import {
  cancelRegistryRepositoryAction,
  confirmAsync,
  confirmDestructiveAsync,
  confirmDisassociate,
  confirmDeletion,
  confirmDetachment,
  confirmDeletionAsync,
  confirmChangePassword,
  confirmImageExport,
  confirmRedeploy,
  confirmUpdate,
  confirmWebEditorDiscard,
  confirm,
} from './confirm';
import {
  confirmContainerDeletion,
  confirmContainerRecreation,
  confirmServiceForceUpdate,
  confirmStackUpdate,
  selectRegistry,
} from './prompt';

/* @ngInject */
export function ModalServiceAngular() {
  return {
    confirmWebEditorDiscard,
    confirmAsync,
    confirmDestructiveAsync,
    confirm,
    cancelRegistryRepositoryAction,
    confirmDeletion,
    confirmDetachment,
    confirmDisassociate,
    confirmUpdate,
    confirmRedeploy,
    confirmDeletionAsync,
    confirmContainerRecreation,
    confirmChangePassword,
    confirmImageExport,
    confirmServiceForceUpdate,
    confirmStackUpdate,
    selectRegistry,
    confirmContainerDeletion,
  };
}
