import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { ModalType } from '@@/modals';

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
