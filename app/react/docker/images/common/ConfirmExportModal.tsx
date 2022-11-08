import { confirm } from '@/portainer/services/modal.service/confirm';
import { ConfirmCallback } from '@/portainer/services/modal.service/ConfirmModal';

export function confirmImageExport(callback: ConfirmCallback) {
  confirm({
    title: 'Caution',
    message:
      'The export may take several minutes, do not navigate away whilst the export is in progress.',
    buttons: {
      confirm: {
        label: 'Continue',
        className: 'btn-primary',
      },
    },
    callback,
  });
}
