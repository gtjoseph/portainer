import { ComponentProps } from 'react';

import { Button } from '@@/buttons';

export interface ButtonOptions {
  label: string;
  className?: string;
  color?: ComponentProps<typeof Button>['color'];
}

export interface ButtonsOptions {
  confirm: ButtonOptions;
  cancel?: ButtonOptions;
}

export enum ModalType {
  Warn = 'warning',
  Destructive = 'error',
}
