import sanitize from 'sanitize-html';

import { Props as ButtonComponentProps } from '@@/buttons/Button';

interface Button {
  label: string;
  className?: string;
  color?: ButtonComponentProps['color'];
}

export interface ButtonsOptions {
  confirm: Button;
  cancel?: Button;
}

export enum ModalTypeIcon {
  Warn = 'warning',
  Destructive = 'error',
}

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

export function buildTitle(
  title: string,
  modalType: ModalTypeIcon = ModalTypeIcon.Warn
) {
  return `
    <div class="background-${modalType}">
      <h5 class="modal-title">${sanitize(title)}</h5>
    </div>
  `;
}

export function applyBoxCSS(box: JQuery<HTMLElement>) {
  box.css({
    'vertical-align': 'middle',
  });
}
