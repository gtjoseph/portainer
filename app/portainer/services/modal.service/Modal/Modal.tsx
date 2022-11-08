import { DialogContent, DialogOverlay } from '@reach/dialog';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import { OnSubmit } from './types';
import styles from './Modal.module.css';

interface Props<TResult> {
  onSubmit: OnSubmit<TResult>;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export function Modal<TResult>({
  children,
  onSubmit,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: PropsWithChildren<Props<TResult>>) {
  return (
    <DialogOverlay
      isOpen
      className="flex items-center justify-center z-50"
      onDismiss={() => {
        onSubmit();
      }}
      role="dialog"
    >
      <DialogContent
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={clsx(styles.modalDialog, 'p-0 bg-transparent')}
      >
        <div className={styles.modalContent}>{children}</div>
      </DialogContent>
    </DialogOverlay>
  );
}
