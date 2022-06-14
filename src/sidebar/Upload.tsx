import { store } from "../state";
import { Show } from "solid-js";
import { OpenMenu } from "../common/OpenMenu";
import { UploadDialog } from "../common/UploadDialog";

export function Upload() {
  return (
    <div class="flex w-full items-center justify-between">
      <OpenMenu name={"Open"} />
      <Show when={store.files.length > 0}>
        <UploadDialog />
      </Show>
    </div>
  );
}
