import { type RenderData, type ReplayData } from "@slippilab/common";
import { createMemo } from "solid-js";
import { For } from "solid-js/web";

import { PlayerHUD } from "~/client/components/app/Viewer/PlayerHUD";
import { Timer } from "~/client/components/app/Viewer/Timer";

export function HUD(props: {
  replay: ReplayData;
  frame: number;
  renderDatas: RenderData[];
}) {
  const playerIndexes = createMemo(() =>
    props.replay.settings.playerSettings
      .filter(Boolean)
      .map((playerSettings) => playerSettings.playerIndex),
  );
  return (
    <>
      <Timer replay={props.replay} frame={props.frame} />
      <For each={playerIndexes()}>
        {(playerIndex) => (
          <PlayerHUD
            replay={props.replay}
            frame={props.frame}
            renderDatas={props.renderDatas}
            player={playerIndex}
          />
        )}
      </For>
    </>
  );
}
