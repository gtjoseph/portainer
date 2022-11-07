import { openDialog, Options } from './Dialog';

export type ConfirmCallback = (confirmed: boolean) => void;

export interface ConfirmAsyncOptions extends Omit<Options, 'title'> {
  title: string;
}

export async function openConfirm(options: ConfirmAsyncOptions) {
  return openDialog(options);
}
