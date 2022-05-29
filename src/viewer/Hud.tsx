import { createMemo, JSX } from "solid-js";
import { For } from "solid-js/web";
import { PlayerHUD } from "./PlayerHUD";
import { store, StoreWithReplay } from "../state";
import { Timer } from "./Timer";

export function Hud(): JSX.Element {
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
