import { createMemo, useContext, For, Show } from "solid-js";
import { characterNameByInternalId } from "~/common/ids";
import { ReplayStoreContext } from "~/state/replayStore";

export function PlayerHUD(props: { player: number }) {
  const [replayState] = useContext(ReplayStoreContext);
  const renderData = createMemo(() =>
    replayState.renderDatas.find(
      (renderData) =>
        renderData.playerSettings.playerIndex === props.player &&
        renderData.playerState.isNana === false
    )
  );
  const position = createMemo(() => ({
    x: -30 + 20 * props.player, // ports at: -30%, -10%, 10%, 30%
    y: 40, // y% is flipped by css to make the text right-side up.
  }));
  const name = createMemo(() =>
    renderData()
      ? [
          renderData()!.playerSettings.displayName,
          renderData()!.playerSettings.connectCode,
          renderData()!.playerSettings.nametag,
          renderData()!.playerSettings.displayName,
          renderData()!.playerSettings.playerType === 1
            ? "CPU"
            : characterNameByInternalId[
                renderData()!.playerState.internalCharacterId
              ],
        ].find((n) => n !== undefined && n.length > 0)
      : ""
  );
  return (
    <>
      <Show when={renderData()}>
        <For each={Array(renderData()!.playerState.stocksRemaining).fill(0)}>
          {(_, i) => (
            <circle
              cx={`${position().x - 2 * (1.5 - i())}%`}
              cy={`-${position().y}%`}
              r={5}
              fill={renderData()!.innerColor}
              stroke="black"
            />
          )}
        </For>
        <text
          style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
          x={`${position().x}%`}
          y={`${position().y + 4}%`}
          text-anchor="middle"
          textContent={`${Math.floor(renderData()!.playerState.percent)}%`}
          fill={renderData()!.innerColor}
          stroke="black"
        />
        <text
          style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
          x={`${position().x}%`}
          y={`${position().y + 7}%`}
          text-anchor="middle"
          textContent={name()}
          fill={renderData()!.innerColor}
          stroke="black"
        />
        <Show when={replayState.isDebug}>
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-40%"
            text-anchor="middle"
            textContent={`State ID: ${renderData()!.playerState.actionStateId}`}
            fill={renderData()!.innerColor}
            stroke="black"
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-37%"
            text-anchor="middle"
            textContent={`State Frame: ${parseFloat(
              renderData()!.playerState.actionStateFrameCounter.toFixed(4)
            )}`}
            fill={renderData()!.innerColor}
            stroke="black"
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-34%"
            text-anchor="middle"
            textContent={`X: ${parseFloat(
              renderData()!.playerState.xPosition.toFixed(4)
            )}`}
            fill={renderData()!.innerColor}
            stroke="black"
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-31%"
            text-anchor="middle"
            textContent={`Y: ${parseFloat(
              renderData()!.playerState.yPosition.toFixed(4)
            )}`}
            fill={renderData()!.innerColor}
            stroke="black"
          />
          <text
            style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
            x={`${position().x}%`}
            y="-28%"
            text-anchor="middle"
            textContent={renderData()!.animationName}
            fill={renderData()!.innerColor}
            stroke="black"
          />
        </Show>
      </Show>
    </>
  );
}
