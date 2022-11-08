import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import styles from './ModalFooter.module.css';

export function ModalFooter({ children }: PropsWithChildren<unknown>) {
  return (
    <div className={clsx(styles.modalFooter, 'flex justify-end')}>
      {children}
    </div>
  );
}
