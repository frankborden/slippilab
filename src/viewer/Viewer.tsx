import { createMemo, For, Show } from "solid-js";
import { Camera } from "./Camera";
import { Controls } from "./Controls";
import { HUD } from "./HUD";
import { Player } from "./Player";
import { Stage } from "./Stage";
import { state } from "../state";

export function Viewer() {
  const playerIndexes = createMemo(() =>
    state
      .replayData()
      ?.settings.playerSettings.filter(Boolean)
      .map((playerSettings) => playerSettings.playerIndex)
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
        {/* TODO: Items, Debug Info */}
        <Camera>
          <Stage />
          <For each={playerIndexes()}>
            {(playerIndex) => <Player player={playerIndex} />}
          </For>
        </Camera>
        <HUD />
        <Controls />
      </svg>
    </Show>
  );
}
