import { createMemo } from "solid-js";
import { For } from "solid-js/web";
import { replayStore } from "~/state/replayStore";
import { PlayerHUD } from "~/viewer/PlayerHUD";
import { Timer } from "~/viewer/Timer";

export function HUD() {
  const playerIndexes = createMemo(() =>
    replayStore
      .replayData!.settings.playerSettings.filter(Boolean)
      .map((playerSettings) => playerSettings.playerIndex)
  );
  return (
    <>
      <Timer />
      <For each={playerIndexes()}>
        {(playerIndex) => <PlayerHUD player={playerIndex} />}
      </For>
    </>
  );
}
