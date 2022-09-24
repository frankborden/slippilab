import { createMemo, For, Show } from "solid-js";
import { Camera } from "~/viewer/Camera";
import { HUD } from "~/viewer/HUD";
import { Players } from "~/viewer/Player";
import { Stage } from "~/viewer/Stage";
import { Item } from "~/viewer/Item";
import { replayStore } from "~/state/replayStore";
import { Controls } from "~/viewer/Controls";

export function Viewer() {
  const items = createMemo(
    () => replayStore.replayData?.frames[replayStore.frame].items ?? []
  );
  return (
    <div class="flex flex-col overflow-y-auto pb-4 pr-4">
      <Show when={replayStore.replayData}>
        <svg class="rounded-t border bg-slate-50" viewBox="-365 -300 730 600">
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
    </div>
  );
}
