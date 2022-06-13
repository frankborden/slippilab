import { createMemo, For, Show } from "solid-js";
import { Camera } from "./Camera";
import { Controls } from "./Controls";
import { Hud } from "./Hud";
import { Players } from "./Player";
import { Stage } from "./Stage";
import { frame, store } from "../state";
import { Item } from "./Item";

export function Viewer() {
  const items = createMemo(() => store.replayData?.frames[frame()].items);
  return (
    <Show when={store.replayData}>
      <svg
        /* up = positive y axis */
        class="h-full w-full bg-slate-50 -scale-y-100"
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
