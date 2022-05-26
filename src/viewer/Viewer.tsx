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
  const olive = {
    olive1: "#fcfdfc",
    olive2: "#f8faf8",
    olive3: "#f2f4f2",
    olive4: "#ecefec",
    olive5: "#e6e9e6",
    olive6: "#e0e4e0",
    olive7: "#d8dcd8",
    olive8: "#c3c8c2",
    olive9: "#8b918a",
    olive10: "#818780",
    olive11: "#6b716a",
    olive12: "#141e12",
  };
  // radix-colors olive1 and olive8
  // const backgroundColor = useColorModeValue("#fcfdfc", "#c3c8c2");
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
