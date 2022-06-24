import { normalizeProps, PropTypes, useMachine, useSetup } from "@zag-js/solid";
import * as dialog from "@zag-js/dialog";
import { createMemo, createUniqueId, JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { Button } from "~/common/Button";

export function Dialog(props: {
  buttonContents?: JSX.Element;
  buttonProps?: Parameters<typeof Button>[0];
  title?: any;
  children?: any;
}) {
  const [dialogState, dialogSend] = useMachine(dialog.machine);
  const dialogRef = useSetup({ send: dialogSend, id: createUniqueId() });
  const dialogApi = createMemo(() =>
    dialog.connect<PropTypes>(dialogState, dialogSend, normalizeProps)
  );
  // const isDialogOpen = createMemo(() => dialogApi().isOpen);
  // const isDialogClosed = createMemo(() => !dialogApi().isOpen);

  return (
    <>
      <Button
        {...props.buttonProps}
        {...dialogApi().triggerProps}
        ref={dialogRef}
      >
        {props.buttonContents}
      </Button>
      <Show when={dialogApi().isOpen}>
        <Portal>
          <div
            {...dialogApi().backdropProps}
            class="absolute top-0 left-0 h-screen w-screen bg-slate-800 opacity-25"
          />
          <div
            {...dialogApi().underlayProps}
            class="absolute top-0 left-0 flex h-full w-full items-center justify-center"
          >
            <div
              {...dialogApi().contentProps}
              class="flex flex-col gap-4 rounded-md bg-slate-50 p-4 w-96"
            >
              <div {...dialogApi().titleProps}>{props.title}</div>
              <div {...dialogApi().descriptionProps}>{props.children}</div>
              <div class="flex justify-end">
                <Button {...dialogApi().closeButtonProps}>Close</Button>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
