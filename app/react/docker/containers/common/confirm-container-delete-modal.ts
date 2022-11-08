import { ModalType } from '@@/modals';
import { openSwitchPrompt } from '@@/modals/SwitchPrompt';

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
