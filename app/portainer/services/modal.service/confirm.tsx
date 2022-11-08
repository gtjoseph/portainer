import sanitize from 'sanitize-html';

import { ModalType } from '@@/modals';
import {
  ConfirmAsyncOptions,
  ConfirmCallback,
  ConfirmOptions,
  openConfirm,
} from '@@/modals/confirm';

import { confirmButtons } from './utils';

export const confirmAsync = openConfirm;

export async function confirm(options: ConfirmOptions) {
  const result = await openConfirm({
    title: options.title,
    message: options.message,
    buttons: confirmButtons(options.buttons),
  });

  options.callback(result);
}

export function confirmDestructiveAsync(
  options: Omit<ConfirmAsyncOptions, 'modalType'>
) {
  return openConfirm({
    ...options,
    modalType: ModalType.Destructive,
  });
}

export function confirmWebEditorDiscard() {
  return openConfirm({
    modalType: ModalType.Warn,
    title: 'Are you sure?',
    message:
      'You currently have unsaved changes in the editor. Are you sure you want to leave?',
    buttons: {
      confirm: {
        label: 'Yes',
        color: 'danger',
      },
    },
  });
}

export function confirmDeletionAsync(message: string) {
  const messageSanitized = sanitize(message);

  return openConfirm({
    title: 'Are you sure?',
    modalType: ModalType.Destructive,
    message: messageSanitized,
    buttons: {
      confirm: {
        label: 'Remove',
        className: 'btn-danger',
      },
    },
  });
}

export async function confirmDeletion(
  message: string,
  callback: ConfirmCallback
) {
  const result = await confirmDeletionAsync(message);
  callback(result);
}

export function confirmUpdate(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);

  confirm({
    title: 'Are you sure?',
    modalType: ModalType.Warn,
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
  return openConfirm({
    modalType: ModalType.Warn,
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
