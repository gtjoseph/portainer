import { confirmAsync } from '@/portainer/services/modal.service/confirm';

export function confirmDisassociate() {
  const message = (
    <>
      <p>
        Disassociating this Edge environment will mark it as non associated and
        will clear the registered Edge ID.
      </p>
      <p>
        Any agent started with the Edge key associated to this environment will
        be able to re-associate with this environment.
      </p>
      <p>
        You can re-use the Edge ID and Edge key that you used to deploy the
        existing Edge agent to associate a new Edge device to this environment.
      </p>
    </>
  );

  return confirmAsync({
    title: 'About disassociating',
    message,
    buttons: {
      confirm: {
        label: 'Disassociate',
        className: 'btn-primary',
      },
    },
  });
}
