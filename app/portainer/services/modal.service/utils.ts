import { ButtonsOptions } from '@@/modals/types';

export function confirmButtons(options: ButtonsOptions) {
  return {
    confirm: {
      label: options.confirm.label,
      className: options.confirm.className && options.confirm.className,
      color: options.confirm.color,
    },
    cancel: {
      label:
        options.cancel && options.cancel.label
          ? options.cancel.label
          : 'Cancel',
      className: 'btn-default',
      color: options.cancel && options.cancel.color,
    },
  };
}
