import { DialogOverlay } from '@reach/dialog';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Button } from '@@/buttons';

import { ButtonsOptions, ModalTypeIcon } from './utils';

export interface Options {
  title?: string;
  message: ReactNode;
  modalType?: ModalTypeIcon;
  buttons: ButtonsOptions;
}

interface Props extends Options {
  onSubmit: (confirmed: boolean) => void;
}

export function Dialog({ buttons, message, title, onSubmit }: Props) {
  return (
    <DialogOverlay
      isOpen
      className="flex items-center justify-center z-50"
      onDismiss={() => onSubmit(false)}
      role="dialog"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {title && (
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
          )}

          <div className="modal-body">
            {!title && (
              <button
                type="button"
                className="bootbox-close-button close"
                onClick={() => onSubmit(false)}
              >
                ×
              </button>
            )}
            <div className="bootbox-body">{message}</div>
          </div>
          <div className="modal-footer">
            {buttons.cancel && (
              <Button
                className={clsx('bootbox-cancel', buttons.cancel.className)}
                onClick={() => onSubmit(false)}
                color={buttons.cancel.color}
              >
                {buttons.cancel.label}
              </Button>
            )}
            <Button
              className={clsx('bootbox-accept', buttons.confirm.className)}
              onClick={() => onSubmit(true)}
              color={buttons.confirm.color}
            >
              {buttons.confirm.label}
            </Button>
          </div>
        </div>
      </div>
    </DialogOverlay>
  );
}

let counter = 0;
export async function openDialog(options: Options) {
  const modal = document.createElement('div');
  counter += 1;
  modal.id = `dialog-${counter}`;
  document.body.appendChild(modal);

  const result = await new Promise<boolean>((resolve) => {
    render(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Dialog {...options} onSubmit={(result) => resolve(result)} />,
      modal
    );
  });

  unmountComponentAtNode(modal);

  return result;
}
