import { PropsWithChildren } from 'react';

import { OnSubmit } from './types';
import styles from './ModalBody.module.css';
import { CloseButton } from './CloseButton';

type ModalBodyProps<TResult> =
  | {
      onSubmit: OnSubmit<TResult>;
      isCloseButtonVisible: true;
    }
  | {
      isCloseButtonVisible?: undefined;
    };

export function ModalBody<TResult>({
  children,
  ...props
}: PropsWithChildren<unknown> & ModalBodyProps<TResult>) {
  return (
    <div className={styles.modalBody}>
      {props.isCloseButtonVisible && <CloseButton onClose={props.onSubmit} />}
      <div className={styles.bootboxBody}>{children}</div>
    </div>
  );
}
