import { createMemo, Show, useContext } from "solid-js";
import { ReplayStoreContext } from "~/state/replayStore";
import { SelectionStoreContext } from "~/state/selectionStore";

export function NowPlaying() {
  const [selectionState] = useContext(SelectionStoreContext);
  const [replayState] = useContext(ReplayStoreContext);
  const info = createMemo(() => {
    return replayState.replayData === undefined ||
      selectionState.selectedFileAndSettings === undefined
      ? {}
      : {
          name: selectionState.selectedFileAndSettings[0].name,
          date: new Date(
            replayState.replayData.settings.startTimestamp
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
