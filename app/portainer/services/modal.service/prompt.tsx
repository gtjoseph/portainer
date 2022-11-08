import { ReactNode, useState } from 'react';

import { SwitchField } from '@@/form-components/SwitchField';
import { Button } from '@@/buttons';

import { Modal } from './Modal';
import { openModal } from './open-modal';
import { OnSubmit } from './Modal/types';
import { ModalType, type ButtonOptions } from './types';

function SwitchPrompt({
  onSubmit,
  title,
  button = { label: 'OK', color: 'primary' },
  switchLabel,
  modalType,
  message,
  defaultValue = false,
}: {
  onSubmit: OnSubmit<{ value: boolean }>;
  title: string;
  switchLabel: string;
  button?: ButtonOptions;
  modalType?: ModalType;
  message?: ReactNode;
  defaultValue?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Modal onSubmit={() => onSubmit()} aria-label={title}>
      <Modal.Header title={title} modalType={modalType} />

      <Modal.Body>
        {message && <div className="mb-3">{message}</div>}
        <SwitchField
          name="value"
          label={switchLabel}
          checked={value}
          onChange={setValue}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSubmit()} color="default">
          Cancel
        </Button>
        <Button
          className={button.className}
          onClick={() => onSubmit({ value })}
          color={button.color}
        >
          {button.label}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export async function openSwitchPrompt(
  title: string,
  switchLabel: string,
  {
    button,
    modalType,
    message,
    defaultValue,
  }: {
    button?: ButtonOptions;
    modalType?: ModalType;
    message?: ReactNode;
    defaultValue?: boolean;
  } = {}
) {
  return openModal(SwitchPrompt, {
    title,
    switchLabel,
    button,
    modalType,
    message,
    defaultValue,
  });
}
