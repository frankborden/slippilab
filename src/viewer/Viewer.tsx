import { createMemo, For, Show, useContext } from "solid-js";
import { Camera } from "~/viewer/Camera";
import { HUD } from "~/viewer/HUD";
import { Players } from "~/viewer/Player";
import { Stage } from "~/viewer/Stage";
import { Item } from "~/viewer/Item";
import { ReplayStoreContext } from "~/state/replayStore";
import { Controls } from "~/viewer/Controls";

export function Viewer() {
  const [replayState] = useContext(ReplayStoreContext);
  const items = createMemo(
    () => replayState.replayData?.frames[replayState.frame].items ?? []
  );
  return (
    <Show when={replayState.replayData}>
      <svg class="rounded-lg border bg-slate-50" viewBox="-365 -300 730 600">
        {/* up = positive y axis */}
        <g class="-scale-y-100">
          <Camera>
            <Stage />
            <Players />
            <For each={items()}>{(item) => <Item item={item} />}</For>
          </Camera>
          <HUD />
        </g>
      </svg>
      <Controls />
    </Show>
  );
}
