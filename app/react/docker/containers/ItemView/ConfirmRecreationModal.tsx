import { useState } from 'react';

import { Modal } from '@/portainer/services/modal.service/Modal';
import { openModal } from '@/portainer/services/modal.service';
import { OnSubmit } from '@/portainer/services/modal.service/Modal/types';
import { ModalType } from '@/portainer/services/modal.service/types';

import { Button } from '@@/buttons';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

interface Props {
  onSubmit: OnSubmit<{ pullLatest: boolean }>;

  cannotPullImage: boolean;
}

function ConfirmRecreationModal({ onSubmit, cannotPullImage }: Props) {
  const [pullLatest, setPullLatest] = useState(false);

  return (
    <Modal onSubmit={onSubmit} aria-label="confirm recreate container modal">
      <Modal.Header title="Are you sure?" modalType={ModalType.Destructive} />

      <Modal.Body>
        <SwitchField
          name="pullLatest"
          label="Pull latest image"
          checked={pullLatest}
          onChange={setPullLatest}
          disabled={cannotPullImage}
        />
        {cannotPullImage && (
          <div className="text-sm mt-1">
            <TextTip color="orange">
              Cannot pull latest as the image is inaccessible - either it no
              longer exists or the tag or name is no longer correct.
            </TextTip>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSubmit()} color="default">
          Cancel
        </Button>
        <Button onClick={() => onSubmit({ pullLatest })} color="danger">
          Recreate
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export async function confirmContainerRecreation(cannotPullImage: boolean) {
  return openModal(ConfirmRecreationModal, {
    cannotPullImage,
  });
}
