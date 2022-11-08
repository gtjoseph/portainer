import { openSwitchPrompt } from '@/portainer/services/modal.service/prompt';
import { ModalType } from '@/portainer/services/modal.service/types';

export async function confirmContainerDeletion(title: string) {
  const result = await openSwitchPrompt(
    title,
    'Automatically remove non-persistent volumes',
    {
      button: { color: 'danger', label: 'Remove' },
      modalType: ModalType.Destructive,
    }
  );

  return result ? { removeVolumes: result.value } : undefined;
}
