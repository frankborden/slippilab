import { createMemo, For, Show } from "solid-js";
import { store } from "~/state";
import { Camera } from "~/viewer/Camera";
import { Controls } from "~/viewer/Controls";
import { Hud } from "~/viewer/Hud";
import { Players } from "~/viewer/Player";
import { Stage } from "~/viewer/Stage";
import { Item } from "~/viewer/Item";

export function Viewer() {
  const items = createMemo(() => store.replayData?.frames[store.frame].items);
  return (
    <Show when={store.replayData}>
      <svg
        /* up = positive y axis */
        class="h-full w-full -scale-y-100 bg-slate-50"
        viewBox="-365 -300 730 600"
      >
        <Camera>
          <Stage />
          <Players />
          <For each={items()}>{(item) => <Item item={item} />}</For>
        </Camera>
        <Hud />
        <Controls />
      </svg>
    </Show>
  );
}
