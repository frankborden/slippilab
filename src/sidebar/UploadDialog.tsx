import {
  createSignal,
  createMemo,
  createUniqueId,
  Match,
  Show,
  Switch,
} from "solid-js";
import { PrimaryButton, WhiteButton } from "~/common/Button";
import { SpinnerCircle } from "~/common/SpinnerCircle";
import { uploadReplay } from "~/supabaseClient";
import { selectionStore } from "~/state/selectionStore";
import * as dialog from "@zag-js/dialog";
import { useMachine, normalizeProps } from "@zag-js/solid";
import { Portal } from "solid-js/web";

export function UploadDialog() {
  const [machineState, send] = useMachine(
    dialog.machine({
      id: createUniqueId(),
      onClose: () => setState("not started"),
    })
  );
  const api = createMemo(() =>
    dialog.connect(machineState, send, normalizeProps)
  );

  const [state, setState] = createSignal<
    "not started" | "loading" | "done" | "copied"
  >("not started");
  const [url, setUrl] = createSignal("");
  const [error, setError] = createSignal("");

  async function onUploadClicked() {
    setState("loading");
    const [file] = selectionStore.selectedFileAndSettings!;
    const { id, data, error } = await uploadReplay(file);
    if (data != null) {
      setUrl(`${window.location.origin}/${id}`);
    } else {
      setError("Error uploading file");
      console.error(error);
    }
    setState("done");
  }

  return (
    <>
      <PrimaryButton {...api().triggerProps}>
        <div class="material-icons text-md">upload_file</div>
      </PrimaryButton>
      <Show when={api().isOpen}>
        <Portal>
          <div
            {...api().backdropProps}
            class="fixed inset-0 backdrop-blur-md backdrop-brightness-90"
          />
          <div
            {...api().underlayProps}
            class="fixed inset-0 flex h-screen w-screen items-center justify-center"
          >
            <div
              {...api().contentProps}
              class="w-full max-w-md rounded-md border bg-white p-8"
              // don't trigger replay shortcuts here.
              onkeydown={(e: Event) => e.stopPropagation()}
              onkeyup={(e: Event) => e.stopPropagation()}
            >
              <h2 {...api().titleProps} class="text-lg">
                Replay Upload
              </h2>
              <div {...api().descriptionProps} class="my-6 flex flex-col">
                <Switch>
                  <Match when={state() === "not started"}>
                    <p class="text-sm">
                      Uploading will send the file{" "}
                      <code>
                        {selectionStore.selectedFileAndSettings?.[0].name}
                      </code>{" "}
                      to Slippi Lab for hosting and you will receive a short
                      link to share out.
                    </p>
                  </Match>
                  <Match when={state() === "loading"}>
                    <div class="h-10 w-10 self-center">
                      <SpinnerCircle />
                    </div>
                  </Match>
                  <Match when={state() === "done" || state() === "copied"}>
                    <Show when={url()} fallback={error()}>
                      <div class="flex items-center gap-2">
                        <code class="text-sm">{url()}</code>
                        <div
                          class="material-icons cursor-pointer rounded bg-slate-100 px-1 py-0 text-lg"
                          onClick={() => {
                            void navigator.clipboard.writeText(url());
                            setState("copied");
                          }}
                        >
                          {state() === "done" ? "content_copy" : "check"}
                        </div>
                      </div>
                    </Show>
                  </Match>
                </Switch>
              </div>
              <div class="flex w-full justify-end gap-2">
                <Switch>
                  <Match when={state() === "not started"}>
                    <WhiteButton {...api().closeButtonProps}>
                      Cancel
                    </WhiteButton>
                    <PrimaryButton onClick={onUploadClicked}>
                      Upload
                    </PrimaryButton>
                  </Match>
                  <Match when={state() === "done" || state() === "copied"}>
                    <WhiteButton {...api().closeButtonProps}>Close</WhiteButton>
                  </Match>
                </Switch>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
