import { createMemo, useContext } from "solid-js";
import { For } from "solid-js/web";
import { ReplayStoreContext } from "~/state/replayStore";
import { PlayerHUD } from "~/viewer/PlayerHUD";
import { Timer } from "~/viewer/Timer";

export function HUD() {
  const [replayState] = useContext(ReplayStoreContext);
  const playerIndexes = createMemo(() =>
    replayState
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
