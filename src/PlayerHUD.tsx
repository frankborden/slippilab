import { createMemo } from "solid-js";
import { characterNameByInternalId } from "./ids";
import { state } from "./state";

export function PlayerHUD(props: { player: number }) {
  const playerState = createMemo(
    () => state.replayData()!.frames[state.frame()].players[props.player].state
  );
  const position = createMemo(() => ({
    x: -30 + 20 * props.player, // ports at: -30%, -10%, 10%, 30%
    y: 40, // y% is flipped by css to make the text right-side up.
  }));
  const color = createMemo(
    () => ["darkred", "darkblue", "gold", "darkgreen"][props.player]
  );
  return (
    <>
      <text
        style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
        x={`${position().x}%`}
        y={`${position().y}%`}
        text-anchor="middle"
        textContent={`${Math.floor(
          playerState().stocksRemaining
        )} stocks remaining`}
        fill={color()}
      />
      <text
        style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
        x={`${position().x}%`}
        y={`${position().y + 3}%`}
        text-anchor="middle"
        textContent={`${Math.floor(playerState().percent)}%`}
        fill={color()}
      />
      <text
        style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
        x={`${position().x}%`}
        y={`${position().y + 6}%`}
        text-anchor="middle"
        textContent={
          // TODO: Slippi name, Slippi code, In-game tag, CPU
          characterNameByInternalId[playerState().internalCharacterId]
        }
        fill={color()}
      />
    </>
  );
}
