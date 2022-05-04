import { createMemo, For, Show } from "solid-js";
import { Camera } from "./Camera";
import { Controls } from "./Controls";
import { HUD } from "./HUD";
import { Player } from "./Player";
import { Stage } from "./Stage";
import { state } from "../state";
import { Item } from "./Item";

export function Viewer() {
  const playerIndexes = createMemo(() =>
    state
      .replayData()
      ?.settings.playerSettings.filter(Boolean)
      .map((playerSettings) => playerSettings.playerIndex)
  );
  const items = createMemo(
    () => state.replayData()?.frames[state.frame()].items
  );
  return (
    <Show when={state.replayData()}>
      <svg
        viewBox="-365 -300 730 600"
        style={{
          "background-color": "gray",
          height: "100%",
          width: "100%",
          /* up = positive y axis */
          transform: "scaleY(-1)",
        }}
      >
        {/* TODO: Debug Info */}
        <Camera>
          <Stage />
          <For each={playerIndexes()}>
            {(playerIndex) => <Player player={playerIndex} />}
          </For>
          <For each={items()}>{(item) => <Item item={item} />}</For>
        </Camera>
        <HUD />
        <Controls />
      </svg>
    </Show>
  );
}
