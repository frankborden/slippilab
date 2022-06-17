import { createMemo } from "solid-js";
import { For } from "solid-js/web";
import { PlayerHUD } from "~/viewer/PlayerHUD";
import { store, StoreWithReplay } from "~/state/state";
import { Timer } from "~/viewer/Timer";

export function Hud() {
  const playerIndexes = createMemo(() =>
    (store as StoreWithReplay).replayData.settings.playerSettings
      .filter(Boolean)
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
