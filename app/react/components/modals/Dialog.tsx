import clsx from 'clsx';
import { ComponentProps, ReactNode } from 'react';

import { Button } from '@@/buttons';

import { ButtonsOptions, ModalType } from './types';
import { openModal } from './open-modal';
import { Modal } from './Modal';

export interface Options {
  title?: string;
  message: ReactNode;
  modalType?: ModalType;
  buttons: ButtonsOptions;
}

interface Props extends Options {
  onSubmit: (confirmed?: boolean) => void;
}

export function Dialog({ buttons, message, title, onSubmit }: Props) {
  return (
    <Modal onDismiss={() => onSubmit()} aria-label={title || String(message)}>
      {title && <Modal.Header title={title} />}
      <Modal.Body isCloseButtonVisible={!title}>{message}</Modal.Body>
      <Modal.Footer>
        {buttons.cancel && (
          <DialogButton
            accept={false}
            onClick={onSubmit}
            label={buttons.cancel.label}
            className={buttons.cancel.className}
            color={buttons.cancel.color}
          />
        )}

        <DialogButton
          accept
          onClick={onSubmit}
          label={buttons.confirm.label}
          className={buttons.confirm.className}
          color={buttons.confirm.color}
        />
      </Modal.Footer>
    </Modal>
  );
}

export function DialogButton({
  accept,
  className,
  onClick,
  label,
  color,
}: {
  accept: boolean;
  className?: string;
  onClick: (confirmed?: boolean) => void;
  label: string;
  color: ComponentProps<typeof Button>['color'];
}) {
  return (
    <Button
      className={clsx('w-full', className)}
      onClick={() => onClick(accept)}
      color={color}
    >
      {label}
    </Button>
  );
}

export async function openDialog(options: Options) {
  return openModal<Options, boolean>(Dialog, options);
}
