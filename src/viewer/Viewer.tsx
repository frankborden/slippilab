import { createMemo, For, Show } from "solid-js";
import { Camera } from "./Camera";
import { Controls } from "./Controls";
import { Hud } from "./Hud";
import { Players } from "./Player";
import { Stage } from "./Stage";
import { frame, store } from "../state";
import { Item } from "./Item";
import { hope } from "@hope-ui/solid";
import { backgroundColor } from "./colors";

export function Viewer() {
  const items = createMemo(() => store.replayData?.frames[frame()].items);
  return (
    <Show when={store.replayData}>
      <hope.svg
        viewBox="-365 -300 730 600"
        backgroundColor={backgroundColor}
        height="$full"
        width="$full"
        /* up = positive y axis */
        transform="scaleY(-1)"
      >
        <Camera>
          <Stage />
          <Players />
          <For each={items()}>{(item) => <Item item={item} />}</For>
        </Camera>
        <Hud />
        <Controls />
      </hope.svg>
    </Show>
  );
}
