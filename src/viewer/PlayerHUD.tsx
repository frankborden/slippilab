import { createMemo, For, Show } from "solid-js";
import { characterNameByInternalId } from "~/common/ids";
import { RenderData, replayStore } from "~/state/replayStore";

export function PlayerHUD(props: { player: number }) {
  const renderData = createMemo(() =>
    replayStore.renderDatas.find(
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
          characterNameByInternalId[
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
        <Show when={replayStore.isDebug}>
          <Debug position={position()} renderData={renderData()!} />
        </Show>
      </Show>
    </>
  );
}

function Debug(props: {
  position: { x: number; y: number };
  renderData: RenderData;
}) {
  return (
    <>
      <text
        style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
        x={`${props.position.x}%`}
        y="-40%"
        text-anchor="middle"
        textContent={`State ID: ${props.renderData.playerState.actionStateId}`}
        fill={props.renderData.innerColor}
        stroke="black"
      />
      <text
        style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
        x={`${props.position.x}%`}
        y="-37%"
        text-anchor="middle"
        textContent={`State Frame: ${parseFloat(
          props.renderData.playerState.actionStateFrameCounter.toFixed(4)
        )}`}
        fill={props.renderData.innerColor}
        stroke="black"
      />
      <text
        style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
        x={`${props.position.x}%`}
        y="-34%"
        text-anchor="middle"
        textContent={`X: ${parseFloat(
          props.renderData.playerState.xPosition.toFixed(4)
        )}`}
        fill={props.renderData.innerColor}
        stroke="black"
      />
      <text
        style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
        x={`${props.position.x}%`}
        y="-31%"
        text-anchor="middle"
        textContent={`Y: ${parseFloat(
          props.renderData.playerState.yPosition.toFixed(4)
        )}`}
        fill={props.renderData.innerColor}
        stroke="black"
      />
      <text
        style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
        x={`${props.position.x}%`}
        y="-28%"
        text-anchor="middle"
        textContent={props.renderData.animationName}
        fill={props.renderData.innerColor}
        stroke="black"
      />
    </>
  );
}
