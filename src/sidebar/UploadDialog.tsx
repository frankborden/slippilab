import { createSignal, Match, Show, Switch } from "solid-js";
import { Button } from "~/common/Button";
import { SpinnerCircle } from "~/common/SpinnerCircle";
import { selectionStore } from "~/state/selectionStore";
import {
  Dialog,
  DialogClose,
  DialogContents,
  DialogTrigger,
} from "~/common/Dialog";
import { uploadReplay } from "~/supabaseClient";

export function UploadDialog() {
  const [state, setState] = createSignal<"not started" | "loading" | "done">(
    "not started"
  );
  const [url, setUrl] = createSignal<string | undefined>();
  const [error, setError] = createSignal<string | undefined>();
  const [isUrlCopied, setIsUrlCopied] = createSignal(false);

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

  function onOpen() {
    setState("not started");
    setIsUrlCopied(false);
    setUrl();
    setError();
  }

  return (
    <Dialog>
      <DialogTrigger onOpen={onOpen}>
        <Button class="text-md flex items-center gap-2 bg-transparent hover:bg-slate-300">
          Upload
          <div class="material-icons">upload_file</div>
        </Button>
      </DialogTrigger>
      <DialogContents>
        <h1 class="text-lg">Replay Upload</h1>
        <div>
          <div class="flex w-96 items-center justify-center gap-2">
            <Switch>
              <Match when={state() === "not started"}>
                <div class="flex flex-col items-center gap-3">
                  <p class="text-sm">
                    Upload {selectionStore.selectedFileAndSettings?.[0].name} to
                    share?
                  </p>
                  <Button
                    onClick={onUploadClicked}
                    class="bg-slate-300 hover:bg-slate-400 text-slate-800"
                  >
                    Upload
                  </Button>
                </div>
              </Match>
              <Match when={state() === "loading"}>
                <div class="h-10 w-10">
                  <SpinnerCircle />
                </div>
              </Match>
              <Match when={state() === "done"}>
                <Show when={url()} fallback={error()}>
                  <code class="text-sm">{url()}</code>
                  <div
                    class="material-icons cursor-pointer rounded bg-slate-100 px-1 py-0 text-lg"
                    onClick={() => {
                      const link = url();
                      if (link === undefined) return;
                      void navigator.clipboard.writeText(link);
                      setIsUrlCopied(true);
                    }}
                  >
                    content_copy
                  </div>
                </Show>
              </Match>
            </Switch>
          </div>
          <Show when={isUrlCopied()}>
            <div class="text-center">Copied!</div>
          </Show>
        </div>
        <DialogClose>
          <div class="flex justify-end">
            <Button>Close</Button>
          </div>
        </DialogClose>
      </DialogContents>
    </Dialog>
  );
}
