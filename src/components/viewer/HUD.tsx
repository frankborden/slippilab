import { createMemo } from "solid-js";
import { For } from "solid-js/web";
import { replayStore } from "~/state/replayStore";
import { PlayerHUD } from "~/components/viewer/PlayerHUD";
import { Timer } from "~/components/viewer/Timer";

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
