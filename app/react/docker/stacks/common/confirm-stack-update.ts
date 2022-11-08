import { openSwitchPrompt } from '@/portainer/services/modal.service/prompt';
import { ModalTypeIcon } from '@/portainer/services/modal.service/utils';

export async function confirmStackUpdate(
  message: string,
  defaultValue: boolean
) {
  const result = await openSwitchPrompt(
    'Are you sure?',
    'Re-pull image and redeploy',
    {
      message,
      button: { color: 'primary', label: 'Update' },
      modalType: ModalTypeIcon.Warn,
      defaultValue,
    }
  );

  return result ? { pullImage: result.value } : undefined;
}
