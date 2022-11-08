import { useState } from 'react';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
  OnSubmit,
  openModal,
} from '@/portainer/services/modal.service/Modal';

import { Button } from '@@/buttons';

import { DeployType } from './types';

export function openDeployTypePrompt() {
  return openModal(DeployTypePrompt);
}

function DeployTypePrompt({
  onSubmit,
}: {
  onSubmit: OnSubmit<{ deployType: DeployType }>;
}) {
  const [deployType, setDeployType] = useState(DeployType.FDO);

  return (
    <Modal onSubmit={() => onSubmit()} aria-label="deploy type prompt">
      <ModalTitle
        onSubmit={() => onSubmit()}
        title="How would you like to add an Edge Device?"
      />

      <ModalBody>
        <label className="inline-flex items-center pt-3">
          <input
            type="radio"
            name="deployType"
            className="form-radio !mt-0"
            value={DeployType.FDO}
            checked={deployType === DeployType.FDO}
            onChange={() => setDeployType(DeployType.FDO)}
          />
          <span className="ml-4 text-sm font-normal">
            Provision bare-metal using Intel FDO
          </span>
        </label>

        <label className="inline-flex items-center pt-3">
          <input
            type="radio"
            name="deployType"
            className="form-radio !mt-0"
            value={DeployType.MANUAL}
            checked={deployType === DeployType.MANUAL}
            onChange={() => setDeployType(DeployType.MANUAL)}
          />
          <span className="ml-4 text-sm font-normal">
            Deploy agent manually
          </span>
        </label>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => onSubmit({ deployType })} color="primary">
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
}
