import {
  confirmAsync,
  confirmDestructiveAsync,
  confirmDeletion,
  confirmDeletionAsync,
  confirmUpdate,
  confirmWebEditorDiscard,
  confirm,
} from './confirm';

export { openModal } from './open-modal';

/* @ngInject */
export function ModalServiceAngular() {
  return {
    confirmWebEditorDiscard,
    confirmAsync,
    confirmDestructiveAsync,
    confirm,
    confirmDeletion,
    confirmUpdate,
    confirmDeletionAsync,
  };
}
