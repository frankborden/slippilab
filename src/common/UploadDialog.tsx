import * as dialog from "@zag-js/dialog";
import { Portal } from "solid-js/web";
import { useMachine, useSetup, normalizeProps } from "@zag-js/solid";
import { createEffect, createMemo, createSignal, on, Show } from "solid-js";
import { Button } from "./Button";
import { store } from "../state";
import { uploadReplay } from "../supabaseClient";
import { SpinnerCircle } from "./SpinnerCircle";

export function UploadDialog() {
  const [dialogState, dialogSend] = useMachine(dialog.machine);
  const dialogRef = useSetup({ send: dialogSend, id: "uploadDialog" });
  const dialogApi = createMemo(() =>
    dialog.connect(dialogState, dialogSend, normalizeProps)
  );
  const isDialogOpen = createMemo(() => dialogApi().isOpen);
  const isDialogClosed = createMemo(() => !dialogApi().isOpen);

  const [isUploading, setIsUploading] = createSignal(false);
  const [url, setUrl] = createSignal<string | undefined>();
  const [error, setError] = createSignal<string | undefined>();
  const [isUrlCopied, setIsUrlCopied] = createSignal(false);

  createEffect(
    on(
      isDialogOpen,
      async () => {
        setIsUploading(true);
        const file = store.files[store.currentFile];
        const { id, data, error } = await uploadReplay(file);
        if (data != null) {
          setUrl(`${window.location.origin}/${id}`);
        } else {
          setError("Error uploading file");
          console.error(error);
        }
        setIsUploading(false);
      },
      { defer: true }
    )
  );

  createEffect(
    on(isDialogClosed, () => {
      setIsUrlCopied(false);
      setUrl();
      setError();
    })
  );

  return (
    <>
      <Button ref={dialogRef} {...dialogApi().triggerProps}>
        Upload
      </Button>
      {dialogApi().isOpen && (
        <Portal>
          {/* @ts-ignore */}
          <div
            {...dialogApi().backdropProps}
            class="absolute top-0 w-screen h-screen left-0 bg-slate-800 opacity-25"
          />
          {/* @ts-ignore */}
          <div
            {...dialogApi().underlayProps}
            class="absolute top-0 left-0 flex w-full h-full justify-center items-center"
          >
            {/* @ts-ignore */}
            <div
              {...dialogApi().contentProps}
              class="bg-slate-50 border border-slate-700 rounded p-4 flex flex-col gap-4"
            >
              {/* @ts-ignore */}
              <h1 {...dialogApi().titleProps} class="text-lg">
                Replay Upload
              </h1>
              {/* @ts-ignore */}
              <div {...dialogApi().descriptionProps}>
                <div class="flex gap-2 justify-center items-center">
                  <Show when={!isUploading()} fallback={<SpinnerCircle />}>
                    <Show when={url()} fallback={error()}>
                      <code class="text-sm">{url()}</code>
                      <Button
                        class="material-icons cursor-pointer text-lg px-1 py-0"
                        onClick={() => {
                          const link = url();
                          if (link === undefined) return;
                          void navigator.clipboard.writeText(link);
                          setIsUrlCopied(true);
                        }}
                      >
                        content_copy
                      </Button>
                      <Show when={isUrlCopied()}>Copied!</Show>
                    </Show>
                  </Show>
                </div>
              </div>
              <div class="flex justify-end">
                {/* @ts-ignore */}
                <Button {...dialogApi().closeButtonProps}>Close</Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
