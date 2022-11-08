import sanitize from 'sanitize-html';

import { confirmButtons, ModalTypeIcon } from './utils';
import {
  ConfirmAsyncOptions,
  ConfirmCallback,
  openConfirm,
} from './ConfirmModal';

interface ConfirmOptions extends ConfirmAsyncOptions {
  callback: ConfirmCallback;
}

export function confirmAsync(options: ConfirmAsyncOptions) {
  return openConfirm({
    ...options,
    modalType: options.modalType || ModalTypeIcon.Warn,
  });
}

export function confirm(options: ConfirmOptions) {
  return (async function innerConfirm() {
    options.callback(
      await confirmAsync({
        title: options.title,
        message: options.message,
        buttons: confirmButtons(options.buttons),
      })
    );
  })();
}

export function confirmDestructiveAsync(
  options: Omit<ConfirmAsyncOptions, 'modalType'>
) {
  return confirmAsync({
    ...options,
    modalType: ModalTypeIcon.Destructive,
  });
}

export function confirmWebEditorDiscard() {
  const options = {
    title: 'Are you sure?',
    message:
      'You currently have unsaved changes in the editor. Are you sure you want to leave?',
    buttons: {
      confirm: {
        label: 'Yes',
        className: 'btn-danger',
      },
    },
  };
  return new Promise((resolve) => {
    confirm({
      ...options,
      callback: (confirmed) => resolve(confirmed),
    });
  });
}

export function confirmDeletionAsync(message: string) {
  return new Promise((resolve) => {
    confirmDeletion(message, (confirmed) => resolve(confirmed));
  });
}

export function confirmDeletion(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);
  confirm({
    title: 'Are you sure?',
    modalType: ModalTypeIcon.Destructive,
    message: messageSanitized,
    buttons: {
      confirm: {
        label: 'Remove',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function confirmUpdate(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);

  confirm({
    title: 'Are you sure?',
    message: messageSanitized,
    buttons: {
      confirm: {
        label: 'Update',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function confirmChangePassword() {
  return confirmAsync({
    title: 'Are you sure?',
    message:
      'You will be logged out after the password change. Do you want to change your password?',
    buttons: {
      confirm: {
        label: 'Change',
        className: 'btn-primary',
      },
    },
  });
}
