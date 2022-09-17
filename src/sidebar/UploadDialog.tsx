import { createSignal, Match, Show, Switch } from "solid-js";
import { PrimaryButton, WhiteButton } from "~/common/Button";
import { SpinnerCircle } from "~/common/SpinnerCircle";
import { uploadReplay } from "~/supabaseClient";
import { selectionStore } from "~/state/selectionStore";
import { Dialog } from "~/common/Dialog";

export function UploadDialog() {
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
    <div>
      <Dialog onClose={() => setState("not started")}>
        <Dialog.Trigger>
          <PrimaryButton>
            <div class="material-icons text-md">upload_file</div>
          </PrimaryButton>
        </Dialog.Trigger>
        <Dialog.Title>
          <h2 class="text-lg">Replay Upload</h2>
        </Dialog.Title>
        <Dialog.Contents>
          <div
            // don't trigger replay shortcuts here.
            onkeydown={(e: Event) => e.stopPropagation()}
            onkeyup={(e: Event) => e.stopPropagation()}
          >
            <div class="flex flex-col">
              <Switch>
                <Match when={state() === "not started"}>
                  <p class="text-sm">
                    Uploading will send the file{" "}
                    <code class="underline">
                      {selectionStore.selectedFileAndSettings?.[0].name}
                    </code>{" "}
                    to Slippi Lab for hosting and you will receive a short link
                    to share out.
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
                  <Dialog.Close>
                    <WhiteButton>Cancel</WhiteButton>
                  </Dialog.Close>
                  <PrimaryButton onClick={onUploadClicked}>
                    Upload
                  </PrimaryButton>
                </Match>
                <Match when={state() === "done" || state() === "copied"}>
                  <Dialog.Close>
                    <WhiteButton>Close</WhiteButton>
                  </Dialog.Close>
                </Match>
              </Switch>
            </div>
          </div>
        </Dialog.Contents>
      </Dialog>
    </div>
  );
}
