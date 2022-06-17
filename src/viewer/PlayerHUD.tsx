import { createMemo, For, Show } from "solid-js";
import { characterNameByInternalId } from "~/common/ids";
import { store, StoreWithReplay } from "~/state/state";
import { playerSettings, renderDatas } from "~/viewer/viewerState";

export function PlayerHUD(props: { player: number }) {
  const playerState = createMemo(
    () =>
      (store as StoreWithReplay).replayData.frames[store.frame].players[
        props.player
      ]?.state
  );
  const position = createMemo(() => ({
    x: -30 + 20 * props.player, // ports at: -30%, -10%, 10%, 30%
    y: 40, // y% is flipped by css to make the text right-side up.
  }));
  const color = createMemo(
    () =>
      renderDatas().find(
        (renderData) =>
          renderData.playerUpdate.playerIndex === props.player &&
          !renderData.isNana
      )?.innerColor
  );
  const name = createMemo(() =>
    [
      playerSettings().find((s) => s.playerIndex === props.player)?.displayName,
      playerSettings().find((s) => s.playerIndex === props.player)?.connectCode,
      playerSettings().find((s) => s.playerIndex === props.player)?.nametag,
      playerSettings().find((s) => s.playerIndex === props.player)
        ?.playerType === 1
        ? "CPU"
        : characterNameByInternalId[playerState()?.internalCharacterId],
    ].find((n) => n !== undefined && n.length > 0)
  );
  return (
    <>
      <Show when={playerState()}>
        <For each={Array(playerState().stocksRemaining).fill(0)}>
          {(_, i) => (
            <circle
              cx={`${position().x - 2 * (1.5 - i())}%`}
              cy={`-${position().y}%`}
              r={5}
              fill={color()}
              stroke="black"
            />
          )}
        </For>
        <text
          style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
          x={`${position().x}%`}
          y={`${position().y + 4}%`}
          text-anchor="middle"
          textContent={`${Math.floor(playerState().percent)}%`}
          fill={color()}
          stroke="black"
        />
        <text
          style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
          x={`${position().x}%`}
          y={`${position().y + 7}%`}
          text-anchor="middle"
          textContent={name()}
          fill={color()}
          stroke="black"
        />
        <Show when={store.isDebug}>
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-40%"
            text-anchor="middle"
            textContent={`State ID: ${playerState().actionStateId}`}
            fill={color()}
            stroke="black"
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-37%"
            text-anchor="middle"
            textContent={`State Frame: ${parseFloat(
              playerState().actionStateFrameCounter.toFixed(4)
            )}`}
            fill={color()}
            stroke="black"
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-34%"
            text-anchor="middle"
            textContent={`X: ${parseFloat(playerState().xPosition.toFixed(4))}`}
            fill={color()}
            stroke="black"
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-31%"
            text-anchor="middle"
            textContent={`Y: ${parseFloat(playerState().yPosition.toFixed(4))}`}
            fill={color()}
            stroke="black"
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-28%"
            text-anchor="middle"
            textContent={
              renderDatas()[
                playerSettings().findIndex(
                  (ps) => ps.playerIndex === props.player
                )
              ]?.animationName
            }
            fill={color()}
            stroke="black"
          />
        </Show>
      </Show>
    </>
  );
}
