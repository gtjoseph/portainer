import { DialogContent, DialogOverlay } from '@reach/dialog';
import { ComponentType, PropsWithChildren } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import clsx from 'clsx';
import '@reach/dialog/styles.css';

import { ModalTypeIcon } from './utils';
import styles from './Modal.module.css';

export type OnSubmit<TResult> = (result?: TResult) => void;

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

interface ModalTitleProps<TResult> {
  onSubmit: OnSubmit<TResult>;
  title: string;
  modalType?: ModalTypeIcon;
}

export function ModalTitle<TResult>({
  title,
  modalType,
  onSubmit,
}: ModalTitleProps<TResult>) {
  return (
    <div className={styles.modalHeader}>
      <button type="button" className={styles.close} onClick={() => onSubmit()}>
        ×
      </button>
      {modalType && (
        <div
          className={clsx({
            [styles.backgroundError]: modalType === ModalTypeIcon.Destructive,
            [styles.backgroundWarning]: modalType === ModalTypeIcon.Warn,
          })}
        />
      )}
      <h5 className={styles.modalTitle}>{title}</h5>
    </div>
  );
}

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
      {props.isCloseButtonVisible && (
        <button
          type="button"
          className={styles.close}
          onClick={() => props.onSubmit()}
        >
          ×
        </button>
      )}
      <div className={styles.bootboxBody}>{children}</div>
    </div>
  );
}

export function ModalFooter({ children }: PropsWithChildren<unknown>) {
  return (
    <div className={clsx(styles.modalFooter, 'flex justify-end')}>
      {children}
    </div>
  );
}

let counter = 0;
export async function openModal<TProps, TResult>(
  Modal: ComponentType<{ onSubmit: OnSubmit<TResult> } & TProps>,
  props: TProps = {} as TProps
) {
  const modal = document.createElement('div');
  counter += 1;
  modal.id = `dialog-${counter}`;
  document.body.appendChild(modal);

  const result = await new Promise<TResult | undefined>((resolve) => {
    render(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Modal {...props} onSubmit={(result) => resolve(result)} />,
      modal
    );
  });

  unmountComponentAtNode(modal);
  document.body.removeChild(modal);

  return result;
}
