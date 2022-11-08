import sanitize from 'sanitize-html';

import { ButtonsOptions } from '@@/modals/types';

export function confirmButtons(options: ButtonsOptions) {
  return {
    confirm: {
      label: sanitize(options.confirm.label),
      className:
        options.confirm.className && sanitize(options.confirm.className),
      color: options.confirm.color,
    },
    cancel: {
      label:
        options.cancel && options.cancel.label
          ? sanitize(options.cancel.label)
          : 'Cancel',
      className: 'btn-default',
      color: options.cancel && options.cancel.color,
    },
  };
}
