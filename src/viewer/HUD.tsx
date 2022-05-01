import { createMemo } from "solid-js";
import { For } from "solid-js/web";
import { PlayerHUD } from "./PlayerHUD";
import { state } from "../state";

export function HUD() {
  const playerIndexes = createMemo(() =>
    state
      .replayData()!
      .settings.playerSettings.filter(Boolean)
      .map((playerSettings) => playerSettings.playerIndex)
  );
  // TODO: Timer
  return (
    <>
      <For each={playerIndexes()}>
        {(playerIndex) => <PlayerHUD player={playerIndex} />}
      </For>
    </>
  );
}
