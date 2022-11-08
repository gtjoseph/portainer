import { ReactNode, useState } from 'react';

import { SwitchField } from '@@/form-components/SwitchField';
import { Button } from '@@/buttons';

import { ModalTypeIcon, ButtonOptions } from './utils';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
  OnSubmit,
  openModal,
} from './Modal';

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
  modalType?: ModalTypeIcon;
  message?: ReactNode;
  defaultValue?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Modal onSubmit={() => onSubmit()} aria-label={title}>
      <ModalTitle
        onSubmit={() => onSubmit()}
        title={title}
        modalType={modalType}
      />

      <ModalBody>
        {message && <div className="mb-3">{message}</div>}
        <SwitchField
          name="value"
          label={switchLabel}
          checked={value}
          onChange={setValue}
        />
      </ModalBody>
      <ModalFooter>
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
      </ModalFooter>
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
    modalType?: ModalTypeIcon;
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
