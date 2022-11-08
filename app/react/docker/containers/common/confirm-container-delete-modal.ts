import { openSwitchPrompt } from '@/portainer/services/modal.service/prompt';
import { ModalTypeIcon } from '@/portainer/services/modal.service/utils';

export async function confirmContainerDeletion(title: string) {
  const result = await openSwitchPrompt(
    title,
    'Automatically remove non-persistent volumes',
    {
      button: { color: 'danger', label: 'Remove' },
      modalType: ModalTypeIcon.Destructive,
    }
  );

  return result ? { removeVolumes: result.value } : undefined;
}
