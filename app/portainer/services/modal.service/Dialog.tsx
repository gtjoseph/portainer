import clsx from 'clsx';
import { ReactNode } from 'react';

import { Button } from '@@/buttons';

import { ButtonsOptions, ModalTypeIcon } from './utils';
import { Modal, ModalBody, ModalFooter, ModalTitle, openModal } from './Modal';

export interface Options {
  title?: string;
  message: ReactNode;
  modalType?: ModalTypeIcon;
  buttons: ButtonsOptions;
}

interface Props extends Options {
  onSubmit: (confirmed?: boolean) => void;
}

export function Dialog({ buttons, message, title, onSubmit }: Props) {
  return (
    <Modal onSubmit={onSubmit}>
      {title && <ModalTitle title={title} onSubmit={onSubmit} />}
      <ModalBody<boolean>
        onSubmit={onSubmit}
        isCloseButtonVisible={!title ? true : (!title as never)}
      >
        {message}
      </ModalBody>
      <ModalFooter>
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
      </ModalFooter>
    </Modal>
  );
}

export async function openDialog(options: Options) {
  return openModal<Options, boolean>(Dialog, options);
}
