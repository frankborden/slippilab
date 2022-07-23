import { createMemo, For, Show, useContext } from "solid-js";
import { Camera } from "~/viewer/Camera";
import { HUD } from "~/viewer/HUD";
import { Players } from "~/viewer/Player";
import { Stage } from "~/viewer/Stage";
import { Item } from "~/viewer/Item";
import { ReplayStoreContext } from "~/state/replayStore";

export function Viewer() {
  const [replayState] = useContext(ReplayStoreContext);
  const items = createMemo(
    () => replayState.replayData?.frames[replayState.frame].items ?? []
  );
  return (
    <Show when={replayState.replayData}>
      <svg
        /* up = positive y axis */
        class="rounded-lg border bg-slate-50"
        viewBox="-365 -300 730 600"
      >
        <g class="-scale-y-100">
          <Camera>
            <Stage />
            <Players />
            <For each={items()}>{(item) => <Item item={item} />}</For>
          </Camera>
          <HUD />
        </g>
      </svg>
    </Show>
  );
}
