import { useState } from 'react';

import { Modal } from '@/portainer/services/modal.service/Modal';
import { openModal } from '@/portainer/services/modal.service';
import { OnSubmit } from '@/portainer/services/modal.service/Modal/types';
import { Registry } from '@/react/portainer/environments/environment.service/registries';

import { Button } from '@@/buttons';
import { PortainerSelect } from '@@/form-components/PortainerSelect';

interface Props {
  registries: Registry[];
  onSubmit: OnSubmit<Registry['Id']>;
  defaultValue: Registry['Id'];
}

function RegistrySelectPrompt({ onSubmit, defaultValue, registries }: Props) {
  const title = 'Which registry do you want to use?';
  const [registryId, setRegistryId] = useState(defaultValue);
  const options = registries2Options(registries);

  return (
    <Modal onSubmit={() => onSubmit()} aria-label={title}>
      <Modal.Header title={title} />

      <Modal.Body>
        <PortainerSelect
          onChange={setRegistryId}
          value={registryId}
          options={options}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSubmit()} color="default">
          Cancel
        </Button>
        <Button onClick={() => onSubmit(registryId)} color="primary">
          Update
        </Button>
      </Modal.Footer>
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
