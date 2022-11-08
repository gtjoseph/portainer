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
    confirmChangePassword,
    confirmImageExport,
  };
}
