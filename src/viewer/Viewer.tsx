import { createMemo, For, Show } from "solid-js";
import { Camera } from "~/viewer/Camera";
import { Hud } from "~/viewer/Hud";
import { Players } from "~/viewer/Player";
import { Stage } from "~/viewer/Stage";
import { Item } from "~/viewer/Item";
import { replayStore } from "~/state/replayStore";

export function Viewer() {
  const items = createMemo(
    () => replayStore.replayData?.frames[replayStore.frame].items ?? []
  );
  return (
    <Show when={replayStore.replayData}>
      <svg
        /* up = positive y axis */
        class="flex-shrink -scale-y-100 rounded-lg bg-slate-50"
        viewBox="-365 -300 730 600"
      >
        <Camera>
          <Stage />
          <Players />
          <For each={items()}>{(item) => <Item item={item} />}</For>
        </Camera>
        <Hud />
      </svg>
    </Show>
  );
}
