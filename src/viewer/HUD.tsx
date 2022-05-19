import { createMemo } from "solid-js";
import { For } from "solid-js/web";
import { PlayerHUD } from "./PlayerHUD";
import { store } from "../state";
import { Timer } from "./Timer";

export function HUD() {
  const playerIndexes = createMemo(() =>
    store
      .replayData!.settings.playerSettings.filter(Boolean)
      .map(playerSettings => playerSettings.playerIndex)
  );
  return (
    <>
      <Timer />
      <For each={playerIndexes()}>
        {playerIndex => <PlayerHUD player={playerIndex} />}
      </For>
    </>
  );
}
