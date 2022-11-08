import { openSwitchPrompt } from '@/portainer/services/modal.service/prompt';
import { ModalType } from '@/portainer/services/modal.service/types';

export async function confirmServiceForceUpdate(message: string) {
  const result = await openSwitchPrompt(
    'Are you sure?',
    'Pull latest image version',
    {
      message,
      button: { color: 'primary', label: 'Update' },
      modalType: ModalType.Warn,
    }
  );

  return result ? { pullLatest: result.value } : undefined;
}
