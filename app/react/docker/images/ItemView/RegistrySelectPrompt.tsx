import { useState } from 'react';

import {
  Modal,
  ModalTitle,
  ModalBody,
  ModalFooter,
  openModal,
} from '@/portainer/services/modal.service/Modal';
import { Registry } from '@/react/portainer/environments/environment.service/registries';

import { Button } from '@@/buttons';
import { PortainerSelect } from '@@/form-components/PortainerSelect';

interface Props {
  registries: Registry[];
  onSubmit: (registryId?: Registry['Id']) => void;
  defaultValue: Registry['Id'];
}

function RegistrySelectPrompt({ onSubmit, defaultValue, registries }: Props) {
  const title = 'Which registry do you want to use?';
  const [registryId, setRegistryId] = useState(defaultValue);
  const options = registries2Options(registries);

  return (
    <Modal onSubmit={() => onSubmit()} aria-label={title}>
      <ModalTitle onSubmit={() => onSubmit()} title={title} />

      <ModalBody>
        <PortainerSelect
          onChange={setRegistryId}
          value={registryId}
          options={options}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => onSubmit()} color="default">
          Cancel
        </Button>
        <Button onClick={() => onSubmit(registryId)} color="primary">
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export function selectRegistry(
  registries: Registry[],
  defaultValue: Registry['Id']
) {
  return openModal(RegistrySelectPrompt, {
    registries,
    defaultValue,
  });
}

function registries2Options(registries: Registry[]) {
  return registries.map((r) => ({
    label: r.Name,
    value: r.Id,
  }));
}
