import { DialogOverlay } from '@reach/dialog';
import { ComponentType, PropsWithChildren } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

type OnSubmit<TResult> = (result?: TResult) => void;

interface Props<TResult> {
  onSubmit: OnSubmit<TResult>;
}

export function Modal<TResult>({
  children,
  onSubmit,
}: PropsWithChildren<Props<TResult>>) {
  return (
    <DialogOverlay
      isOpen
      className="flex items-center justify-center z-50"
      onDismiss={() => onSubmit()}
      role="dialog"
    >
      <div className="modal-dialog">
        <div className="modal-content">{children}</div>
      </div>
    </DialogOverlay>
  );
}

interface ModalTitleProps<TResult> {
  onSubmit: OnSubmit<TResult>;
  title: string;
}

export function ModalTitle<TResult>({
  title,
  onSubmit,
}: ModalTitleProps<TResult>) {
  return (
    <div className="modal-header">
      <button type="button" className="close" onClick={() => onSubmit()}>
        ×
      </button>
      <h5 className="modal-title">{title}</h5>
    </div>
  );
}

type ModalBodyProps<TResult> =
  | {
      onSubmit: OnSubmit<TResult>;
      isCloseButtonVisible: true;
    }
  | {
      isCloseButtonVisible: never;
    };

export function ModalBody<TResult>({
  children,
  ...props
}: PropsWithChildren<ModalBodyProps<TResult>>) {
  return (
    <div className="modal-body">
      {props.isCloseButtonVisible && (
        <button
          type="button"
          className="bootbox-close-button close"
          onClick={() => props.onSubmit()}
        >
          ×
        </button>
      )}
      <div className="bootbox-body">{children}</div>
    </div>
  );
}

export function ModalFooter({ children }: PropsWithChildren<unknown>) {
  return <div className="modal-footer">{children}</div>;
}

let counter = 0;
export async function openModal<TProps, TResult>(
  Modal: ComponentType<{ onSubmit: OnSubmit<TResult> } & TProps>,
  props: TProps
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

  return result;
}
