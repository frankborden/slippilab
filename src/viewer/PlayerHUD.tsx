import { createMemo, For, Show } from "solid-js";
import { characterNameByInternalId } from "../common/ids";
import { state } from "../state";

export function PlayerHUD(props: { player: number }) {
  const playerState = createMemo(
    () => state.replayData()!.frames[state.frame()].players[props.player]?.state
  );
  const playerSettings = createMemo(
    () => state.replayData()!.settings.playerSettings[props.player]
  );
  const position = createMemo(() => ({
    x: -30 + 20 * props.player, // ports at: -30%, -10%, 10%, 30%
    y: 40, // y% is flipped by css to make the text right-side up.
  }));
  const color = createMemo(() => getPlayerColor(props.player));
  const name = createMemo(() =>
    [
      playerSettings().displayName,
      playerSettings().connectCode,
      playerSettings().nametag,
      playerSettings().playerType === 1
        ? "CPU"
        : characterNameByInternalId[playerState()?.internalCharacterId],
    ].find(n => n?.length > 0)
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
        />
        <text
          style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
          x={`${position().x}%`}
          y={`${position().y + 7}%`}
          text-anchor="middle"
          textContent={name()}
          fill={color()}
        />
        <Show when={state.isDebug()}>
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-40%"
            text-anchor="middle"
            textContent={`State: ${playerState().actionStateId}`}
            fill={color()}
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-37%"
            text-anchor="middle"
            textContent={`Frame: ${parseFloat(
              playerState().actionStateFrameCounter.toFixed(4)
            )}`}
            fill={color()}
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-34%"
            text-anchor="middle"
            textContent={`X: ${parseFloat(playerState().xPosition.toFixed(4))}`}
            fill={color()}
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-31%"
            text-anchor="middle"
            textContent={`Y: ${parseFloat(playerState().yPosition.toFixed(4))}`}
            fill={color()}
          />
        </Show>
      </Show>
    </>
  );
}

// TODO: dedupe with same code in Player.tsx
function getPlayerColor(playerIndex: number) {
  if (state.replayData()!.settings.isTeams) {
    const teamId =
      state.replayData()!.settings.playerSettings[playerIndex].teamId;
    return ["darkred", "darkblue", "darkgreen"][teamId];
  }
  return ["darkred", "darkblue", "gold", "darkgreen"][playerIndex];
}
