import { useState } from 'react';

import {
  Modal,
  ModalTitle,
  ModalBody,
  ModalFooter,
  openModal,
} from '@/portainer/services/modal.service/Modal';

import { Button } from '@@/buttons';
import { SwitchField } from '@@/form-components/SwitchField';

function UpdateIngressPrompt({
  onSubmit,
  title,
  hasOneIngress,
  hasOnePort,
}: {
  onSubmit: (value?: { noMatch: boolean }) => void;
  title: string;
  hasOneIngress: boolean;
  hasOnePort: boolean;
}) {
  const [value, setValue] = useState(false);

  const rulePlural = !hasOneIngress ? 'rules' : 'rule';
  const noMatchSentence = !hasOnePort
    ? `Service ports in this application no longer match the ingress ${rulePlural}.`
    : `A service port in this application no longer matches the ingress ${rulePlural} which may break ingress rule paths.`;
  const inputLabel = `Update ingress ${rulePlural} to match the service port changes`;

  return (
    <Modal onSubmit={() => onSubmit()} aria-label={title}>
      <ModalTitle onSubmit={() => onSubmit()} title={title} />

      <ModalBody>
        <ul className="ml-3">
          <li>Updating the application may cause a service interruption.</li>
          <li>{noMatchSentence}</li>
        </ul>

        <SwitchField
          name="noMatch"
          label={inputLabel}
          checked={value}
          onChange={setValue}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => onSubmit({ noMatch: value })} color="primary">
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export function confirmUpdateAppIngress(
  ingressesToUpdate: Array<unknown>,
  servicePortsToUpdate: Array<unknown>
) {
  const hasOneIngress = ingressesToUpdate.length === 1;
  const hasOnePort = servicePortsToUpdate.length === 1;

  return openModal(UpdateIngressPrompt, {
    title: 'Are you sure?',
    hasOneIngress,
    hasOnePort,
  });
}
