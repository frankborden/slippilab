import { createMemo, Show } from "solid-js";
import { replayStore } from "~/state/replayStore";
import { selectionStore } from "~/state/selectionStore";

export function NowPlaying() {
  const info = createMemo(() => {
    return replayStore.replayData === undefined ||
      selectionStore.selectedFileAndSettings === undefined
      ? {}
      : {
          name: selectionStore.selectedFileAndSettings[0].name,
          date: new Date(
            replayStore.replayData.settings.startTimestamp
          ).toLocaleString(),
        };
  });
  return (
    <>
      <div class="flex items-center gap-4">
        <div class="whitespace-nowrap text-xl ">{info().name}</div>
        <Show when={info().date}>
          <div class="whitespace-nowrap text-xl">{info().date}</div>
        </Show>
      </div>
    </>
  );
}
