import { ConfirmCallback, openConfirm } from '@@/modals/confirm';

export async function confirmImageExport(callback: ConfirmCallback) {
  const result = await openConfirm({
    title: 'Caution',
    message:
      'The export may take several minutes, do not navigate away whilst the export is in progress.',
    buttons: {
      confirm: {
        label: 'Continue',
        className: 'btn-primary',
      },
    },
  });

  callback(result);
}
