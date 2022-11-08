import clsx from 'clsx';

import { ModalType } from '../types';

import { CloseButton } from './CloseButton';
import styles from './ModalHeader.module.css';
import { OnSubmit } from './types';

interface Props<TResult> {
  onSubmit: OnSubmit<TResult>;
  title: string;
  modalType?: ModalType;
}

export function ModalHeader<TResult>({
  title,
  modalType,
  onSubmit,
}: Props<TResult>) {
  return (
    <div className={styles.modalHeader}>
      <CloseButton onClose={onSubmit} className={styles.close} />
      {modalType && (
        <div
          className={clsx({
            [styles.backgroundError]: modalType === ModalType.Destructive,
            [styles.backgroundWarning]: modalType === ModalType.Warn,
          })}
        />
      )}
      <h5 className={styles.modalTitle}>{title}</h5>
    </div>
  );
}
