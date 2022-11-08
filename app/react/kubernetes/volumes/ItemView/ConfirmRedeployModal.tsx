import { confirmAsync } from '@/portainer/services/modal.service/confirm';

export function confirmRedeploy() {
  return confirmAsync({
    title: '',
    message: (
      <>
        One or multiple applications are currently using this volume.
        <br /> For the change to be taken into account these applications will
        need to be redeployed. Do you want us to reschedule it now?
      </>
    ),
    buttons: {
      confirm: {
        label: 'Redeploy the applications',
        className: 'btn-primary',
      },
      cancel: {
        label: "I'll do it later",
      },
    },
  });
}
