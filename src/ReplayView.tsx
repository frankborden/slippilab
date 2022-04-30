import { createMemo, For } from "solid-js";
import { ReplayCamera } from "./ReplayCamera";
import { ReplayControls } from "./ReplayControls";
import { ReplayHUD } from "./ReplayHUD";
import { ReplayPlayer } from "./ReplayPlayer";
import { ReplayStage } from "./ReplayStage";
import { state } from "./state";

export function ReplayView() {
  const playerIndexes = createMemo(() =>
    state
      .replayData()!
      .settings.playerSettings.filter(Boolean)
      .map((playerSettings) => playerSettings.playerIndex)
  );
  return (
    <>
      <div>
        Frame: {state.frame()} / {state.replayData()!.frames.length - 1}
      </div>
      {/* TODO: Items, Debug Info */}
      <svg
        viewBox="-365 -300 730 600"
        style={{
          "background-color": "gray",
          "aspect-ratio": "73/60",
          "max-width": "80vw",
          "max-height": "80vh",
          /* up = positive y axis */
          transform: "scaleY(-1)",
        }}
      >
        <ReplayCamera>
          <ReplayStage />
          <For each={playerIndexes()}>
            {(playerIndex) => <ReplayPlayer player={playerIndex} />}
          </For>
        </ReplayCamera>
        <ReplayHUD />
        <ReplayControls />
      </svg>
    </>
  );
}
