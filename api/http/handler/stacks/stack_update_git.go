package stacks

import (
	"errors"
	"net/http"
	"time"

	"github.com/asaskevich/govalidator"
	httperror "github.com/portainer/libhttp/error"
	"github.com/portainer/libhttp/request"
	"github.com/portainer/libhttp/response"
	portainer "github.com/portainer/portainer/api"
	bolterrors "github.com/portainer/portainer/api/bolt/errors"
	httperrors "github.com/portainer/portainer/api/http/errors"
	"github.com/portainer/portainer/api/http/security"
	"github.com/portainer/portainer/api/internal/stackutils"
)

type stackGitUpdatePayload struct {
	AutoUpdate              *portainer.StackAutoUpdate
	Env                     []portainer.Pair
	RepositoryReferenceName string
}

func (payload *stackGitUpdatePayload) Validate(r *http.Request) error {
	if govalidator.IsNull(payload.RepositoryReferenceName) {
		return errors.New("Invalid RepositoryReferenceName")
	}
	if err := validateStackAutoUpdate(payload.AutoUpdate); err != nil {
		return err
	}
	return nil
}

// @id Stacks
// @summary Update and redeploy an existing stack (with Git config)
// @description  Update and redeploy an existing stack (with Git config)
// @description **Access policy**: authenticated
// @tags stacks
// @security jwt
// @produce json
// @param id path int true "Stack identifier"
// @param endpointId query int false "Stacks created before version 1.18.0 might not have an associated endpoint identifier. Use this optional parameter to set the endpoint identifier used by the stack."
// @param body body stackGitUpdatePayload true "Stack Git config"
// @success 200 {object} portainer.Stack "Success"
// @failure 400 "Invalid request"
// @failure 403 "Permission denied"
// @failure 404 "Not found"
// @failure 500 "Server error"
// @router /stacks/{id}/git
func (handler *Handler) stackGitUpdate(w http.ResponseWriter, r *http.Request) *httperror.HandlerError {
	stackID, err := request.RetrieveNumericRouteVariableValue(r, "id")
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusBadRequest, Message: "Invalid stack identifier route variable", Err: err}
	}

	var payload stackGitUpdatePayload
	err = request.DecodeAndValidateJSONPayload(r, &payload)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusBadRequest, Message: "Invalid request payload", Err: err}
	}

	stack, err := handler.DataStore.Stack().Stack(portainer.StackID(stackID))
	if err == bolterrors.ErrObjectNotFound {
		return &httperror.HandlerError{StatusCode: http.StatusNotFound, Message: "Unable to find a stack with the specified identifier inside the database", Err: err}
	} else if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: "Unable to find a stack with the specified identifier inside the database", Err: err}
	} else if stack.GitConfig == nil {
		msg := "No Git config in the found stack"
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: msg, Err: errors.New(msg)}
	}

	// TODO: this is a work-around for stacks created with Portainer version >= 1.17.1
	// The EndpointID property is not available for these stacks, this API endpoint
	// can use the optional EndpointID query parameter to associate a valid endpoint identifier to the stack.
	endpointID, err := request.RetrieveNumericQueryParameter(r, "endpointId", true)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusBadRequest, Message: "Invalid query parameter: endpointId", Err: err}
	}
	if endpointID != int(stack.EndpointID) {
		stack.EndpointID = portainer.EndpointID(endpointID)
	}

	endpoint, err := handler.DataStore.Endpoint().Endpoint(stack.EndpointID)
	if err == bolterrors.ErrObjectNotFound {
		return &httperror.HandlerError{StatusCode: http.StatusNotFound, Message: "Unable to find the endpoint associated to the stack inside the database", Err: err}
	} else if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: "Unable to find the endpoint associated to the stack inside the database", Err: err}
	}

	err = handler.requestBouncer.AuthorizedEndpointOperation(r, endpoint)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusForbidden, Message: "Permission denied to access endpoint", Err: err}
	}

	resourceControl, err := handler.DataStore.ResourceControl().ResourceControlByResourceIDAndType(stackutils.ResourceControlID(stack.EndpointID, stack.Name), portainer.StackResourceControl)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: "Unable to retrieve a resource control associated to the stack", Err: err}
	}

	securityContext, err := security.RetrieveRestrictedRequestContext(r)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: "Unable to retrieve info from request context", Err: err}
	}

	access, err := handler.userCanAccessStack(securityContext, endpoint.ID, resourceControl)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: "Unable to verify user authorizations to validate stack access", Err: err}
	}
	if !access {
		return &httperror.HandlerError{StatusCode: http.StatusForbidden, Message: "Access denied to resource", Err: httperrors.ErrResourceAccessDenied}
	}

	//update retrieved stack data based on payload
	stack.GitConfig.ReferenceName = payload.RepositoryReferenceName
	stack.AutoUpdate = payload.AutoUpdate
	stack.Env = payload.Env

	//compose git clone params based on stack info
	gitCloneParams := &cloneRepositoryParameters{
		url:           stack.GitConfig.URL,
		referenceName: stack.GitConfig.ReferenceName,
		path:          stack.ProjectPath,
	}
	if stack.GitConfig.Authentication != nil && stack.GitConfig.Authentication.Password != "" {
		gitCloneParams.authentication = true
		gitCloneParams.username = stack.GitConfig.Authentication.Username
		gitCloneParams.password = stack.GitConfig.Authentication.Password
	}

	//distribute requests based on stack types
	//use composed gitCloneParams
	var updateError *httperror.HandlerError
	switch stack.Type {
	case portainer.DockerComposeStack:
		updateError = handler.updateComposeStackFromGit(r, stack, endpoint, gitCloneParams)
	case portainer.DockerSwarmStack:
		updateError = handler.updateSwarmStackFromGit(r, stack, endpoint, gitCloneParams)
	default:
		msg := "Unsupported stack type"
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: msg, Err: errors.New(msg)}
	}
	if updateError != nil {
		return updateError
	}

	//save the updated stack to DB
	err = handler.DataStore.Stack().UpdateStack(stack.ID, stack)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: "Unable to persist the stack changes inside the database", Err: err}
	}

	return response.JSON(w, stack)
}

func (handler *Handler) updateComposeStackFromGit(r *http.Request, stack *portainer.Stack, endpoint *portainer.Endpoint, gitCloneParams *cloneRepositoryParameters) *httperror.HandlerError {
	doCleanUp := true
	defer handler.cleanUp(stack, &doCleanUp)

	err := handler.cloneGitRepository(gitCloneParams)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: "Unable to clone git repository", Err: err}
	}

	config, configErr := handler.createComposeDeployConfig(r, stack, endpoint)
	if configErr != nil {
		return configErr
	}

	err = handler.deployComposeStack(config)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: err.Error(), Err: err}
	}

	stack.UpdateDate = time.Now().Unix()
	stack.UpdatedBy = config.user.Username

	doCleanUp = false
	return nil
}

func (handler *Handler) updateSwarmStackFromGit(r *http.Request, stack *portainer.Stack, endpoint *portainer.Endpoint, gitCloneParams *cloneRepositoryParameters) *httperror.HandlerError {
	doCleanUp := true
	defer handler.cleanUp(stack, &doCleanUp)

	err := handler.cloneGitRepository(gitCloneParams)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: "Unable to clone git repository", Err: err}
	}

	config, configErr := handler.createSwarmDeployConfig(r, stack, endpoint, false)
	if configErr != nil {
		return configErr
	}

	err = handler.deploySwarmStack(config)
	if err != nil {
		return &httperror.HandlerError{StatusCode: http.StatusInternalServerError, Message: err.Error(), Err: err}
	}

	stack.UpdateDate = time.Now().Unix()
	stack.UpdatedBy = config.user.Username

	doCleanUp = false
	return nil
}