import { openSwitchPrompt } from '@/portainer/services/modal.service/prompt';
import { ModalTypeIcon } from '@/portainer/services/modal.service/utils';

export async function confirmServiceForceUpdate(message: string) {
  const result = await openSwitchPrompt(
    'Are you sure?',
    'Pull latest image version',
    {
      message,
      button: { color: 'primary', label: 'Update' },
      modalType: ModalTypeIcon.Warn,
    }
  );

  return result ? { pullLatest: result.value } : undefined;
}
