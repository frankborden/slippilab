import { createMemo, For, Show } from "solid-js";
import { Camera } from "./Camera";
import { Controls } from "./Controls";
import { HUD } from "./HUD";
import { Player } from "./Player";
import { Stage } from "./Stage";
import { frame, store } from "../state";
import { Item } from "./Item";
import { hope, useColorModeValue } from "@hope-ui/solid";

export function Viewer() {
  const backgroundColor = useColorModeValue("white", "gray");
  const playerIndexes = createMemo(() =>
    store.replayData?.settings.playerSettings
      .filter(Boolean)
      .map(playerSettings => playerSettings.playerIndex)
  );
  const items = createMemo(() => store.replayData?.frames[frame()].items);
  return (
    <Show when={store.replayData}>
      <hope.svg
        viewBox="-365 -300 730 600"
        backgroundColor={backgroundColor()}
        height="$full"
        width="$full"
        /* up = positive y axis */
        transform="scaleY(-1)"
      >
        <Camera>
          <Stage />
          <For each={playerIndexes()}>
            {playerIndex => <Player player={playerIndex} />}
          </For>
          <For each={items()}>{item => <Item item={item} />}</For>
        </Camera>
        <HUD />
        <Controls />
      </hope.svg>
    </Show>
  );
}
