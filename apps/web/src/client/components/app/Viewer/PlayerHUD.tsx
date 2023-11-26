import { type RenderData, type ReplayData } from "@slippilab/common";
import { charactersInt } from "@slippilab/common";
import cn from "clsx";
import { For, Show, createMemo } from "solid-js";

import {
  getPlayerColor,
  playerHUDStrokeColor,
} from "~/client/components/app/Viewer/colors";

export function PlayerHUD(props: {
  replay: ReplayData;
  frame: number;
  player: number;
  renderDatas: RenderData[];
}) {
  const renderData = createMemo(() =>
    props.renderDatas.find(
      (renderData) =>
        renderData.playerSettings.playerIndex === props.player &&
        renderData.playerState.isNana === false,
    ),
  );
  const position = createMemo(() => ({
    x: -30 + 20 * props.player, // ports at: -30%, -10%, 10%, 30%
    y: 35, // y% is flipped by css to make the text right-side up.
  }));
  const name = createMemo(() =>
    renderData()
      ? [
          renderData()!.playerSettings.displayName,
          renderData()!.playerSettings.connectCode,
          renderData()!.playerSettings.nametag,
          renderData()!.playerSettings.displayName,
          charactersInt[renderData()!.playerState.internalCharacterId],
        ].find((n) => n !== undefined && n.length > 0)
      : "",
  );

  return (
    <>
      <Show when={renderData()}>
        <For each={Array(renderData()!.playerState.stocksRemaining).fill(0)}>
          {(_, i) => (
            <image
              class="sepia-100"
              style={{
                transform: "scaleY(-1)",
                filter: `sepia(1) hue-rotate(${
                  [0 - 30, 224 - 30, 45 - 30, 142 - 30][
                    props.replay.settings.isTeams
                      ? [0, 3, 1][renderData()!.playerSettings.teamId]
                      : renderData()!.playerSettings.playerIndex
                  ]
                }deg) saturate(2)`,
              }}
              href={`/stockicons/${
                renderData()!.playerSettings.externalCharacterId
              }/${renderData()!.playerSettings.costumeIndex}.png`}
              height="20"
              width="20"
              x={`${position().x - 3 * (2 - i())}%`}
              y={`${position().y - 1}%`}
            />
          )}
        </For>
        <text
          class={cn(
            "brightness-150",
            getPlayerColor(
              props.replay,
              renderData()!.playerState.playerIndex,
              renderData()!.playerState.isNana,
            ),
            playerHUDStrokeColor,
          )}
          style={{ font: "bold 20px sans-serif", transform: "scaleY(-1)" }}
          x={`${position().x}%`}
          y={`${position().y + 7}%`}
          text-anchor="middle"
          textContent={`${Math.floor(renderData()!.playerState.percent)}%`}
        />
        <text
          class={cn(
            "brightness-150",
            getPlayerColor(
              props.replay,
              renderData()!.playerState.playerIndex,
              renderData()!.playerState.isNana,
            ),
            playerHUDStrokeColor,
          )}
          style={{ font: "bold 20px sans-serif", transform: "scaleY(-1)" }}
          x={`${position().x}%`}
          y={`${position().y + 12}%`}
          text-anchor="middle"
          textContent={name()}
        />
      </Show>
    </>
  );
}
