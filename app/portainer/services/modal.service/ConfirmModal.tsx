import { DialogOverlay } from '@reach/dialog';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { ButtonsOptions, ModalTypeIcon } from './utils';

export type ConfirmCallback = (confirmed: boolean) => void;

export interface ConfirmAsyncOptions {
  title: string;
  message: ReactNode;
  modalType?: ModalTypeIcon;
  buttons: ButtonsOptions;
}

export interface ConfirmOptions extends ConfirmAsyncOptions {
  callback: ConfirmCallback;
}

interface Props {
  options: ConfirmAsyncOptions;
  onSubmit: (confirmed: boolean) => void;
}

function ConfirmModal({
  options: { buttons, message, title },
  onSubmit,
}: Props) {
  return (
    <DialogOverlay
      isOpen
      className="flex items-center justify-center"
      onDismiss={() => onSubmit(false)}
      role="dialog"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => onSubmit(false)}
            >
              ×
            </button>
            <h5 className="modal-title">{title}</h5>
          </div>

          <div className="modal-body">
            <div className="bootbox-body">{message}</div>
          </div>
          <div className="modal-footer">
            {buttons.cancel && (
              <button
                type="button"
                className={clsx('btn bootbox-cancel', buttons.cancel.className)}
                onClick={() => onSubmit(false)}
              >
                {buttons.cancel.label}
              </button>
            )}
            <button
              type="button"
              className={clsx('btn bootbox-accept', buttons.confirm.className)}
              onClick={() => onSubmit(true)}
            >
              {buttons.confirm.label}
            </button>
          </div>
        </div>
      </div>
    </DialogOverlay>
  );
}

let counter = 0;

export async function openConfirm(options: ConfirmAsyncOptions) {
  const modal = document.createElement('div');
  counter += 1;
  modal.id = `confirm-modal-${counter}`;
  document.body.appendChild(modal);

  const result = await new Promise<boolean>((resolve) => {
    render(
      <ConfirmModal options={options} onSubmit={(result) => resolve(result)} />,
      modal
    );
  });

  unmountComponentAtNode(modal);

  return result;
}
