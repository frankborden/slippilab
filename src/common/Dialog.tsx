import { Setter } from "solid-js";
import {
  Accessor,
  createContext,
  createMemo,
  createSignal,
  useContext,
} from "solid-js";
import { Portal } from "solid-js/web";

const DialogRefContext =
  createContext<
    [
      Accessor<HTMLDialogElement | undefined>,
      Setter<HTMLDialogElement | undefined>
    ]
  >();

export function Dialog(props: { onOpen?: () => void; children?: any }) {
  let [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | undefined>();

  return (
    <DialogRefContext.Provider value={[dialogRef, setDialogRef]}>
      {props.children}
    </DialogRefContext.Provider>
  );
}

export function DialogTrigger(props: {
  children?: any;
  onOpen?: () => void;
  class?: string;
}) {
  const context = useContext(DialogRefContext);
  const dialogRef = createMemo(() => context?.[0]);
  return (
    <div
      class={props.class ?? ""}
      onClick={() => {
        props.onOpen?.();
        dialogRef?.()?.()?.showModal();
      }}
    >
      {props.children}
    </div>
  );
}

export function DialogContents(props: { children?: any }) {
  const context = useContext(DialogRefContext);
  const dialogRef = createMemo(() => context?.[0]);
  const setDialogRef = createMemo(() => context?.[1]);
  return (
    <Portal>
      <dialog
        ref={setDialogRef()}
        class="rounded-lg backdrop:bg-gray-500 backdrop:opacity-75 flex flex-col gap-4"
        onClick={(e) =>
          e.target === dialogRef()?.() && dialogRef()?.()?.close()
        }
      >
        {props.children}
      </dialog>
    </Portal>
  );
}

export function DialogClose(props: { children?: any }) {
  const context = useContext(DialogRefContext);
  const dialogRef = createMemo(() => context?.[0]);
  return <div onClick={() => dialogRef?.()?.()?.close()}>{props.children}</div>;
}
