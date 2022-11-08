import { openDialog, Options } from './Dialog';
import { OnSubmit } from './Modal/types';

export type ConfirmCallback = OnSubmit<boolean>;

export interface ConfirmAsyncOptions extends Omit<Options, 'title'> {
  title: string;
}

export interface ConfirmOptions extends ConfirmAsyncOptions {
  callback: ConfirmCallback;
}

export async function openConfirm(options: ConfirmAsyncOptions) {
  return openDialog(options);
}
