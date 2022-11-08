import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { ModalType } from '@@/modals';

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
      modalType: ModalType.Warn,
      defaultValue,
    }
  );

  return result ? { pullImage: result.value } : undefined;
}
