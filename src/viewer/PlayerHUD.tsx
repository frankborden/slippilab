import { createMemo, useContext, For, Show } from "solid-js";
import { characterNameByInternalId } from "~/common/ids";
import { RenderData, ReplayStoreContext } from "~/state/replayStore";

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
          <Debug position={position()} renderData={renderData()!} />
        </Show>
        <Show when={replayState.showInputDisplay}>
          <Inputs renderData={renderData()!} portX={position().x} />
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

function Inputs(props: { renderData: RenderData; portX: number }) {
  return (
    <svg
      x={`${props.portX - 10}%`}
      y="30%"
      width="20%"
      height="20%"
      viewBox="0 0 100 100"
    >
      <g transform="translate(50, 50) scale(1, 1)">
        {/* joystick */}
        <circle
          cx={`${-30 + 5 * props.renderData.playerInputs.processed.joystickX}%`}
          cy={`${5 * props.renderData.playerInputs.processed.joystickY}%`}
          r="10%"
          fill="lightgray"
          stroke="black"
        />
        <circle
          cx={`${-30 + 5 * props.renderData.playerInputs.processed.joystickX}%`}
          cy={`${5 * props.renderData.playerInputs.processed.joystickY}%`}
          r={"7%"}
          fill="lightgray"
          stroke="black"
        />
        <circle cx={`${-30}%`} cy={0} r="1.5%" fill="black" />
        {/* cstick */}
        <circle
          cx={`${20 + 5 * props.renderData.playerInputs.processed.cStickX}%`}
          cy={`${-30 + 5 * props.renderData.playerInputs.processed.cStickY}%`}
          r="10%"
          fill="yellow"
          stroke="black"
        />
        <circle
          cx={`${20 + 5 * props.renderData.playerInputs.processed.cStickX}%`}
          cy={`${-30 + 5 * props.renderData.playerInputs.processed.cStickY}%`}
          r="7%"
          fill="yellow"
          stroke="black"
        />
        <circle cx={`${20}%`} cy={-30} r="1.5%" fill="black" />
        {/* buttons */}
        {/* A */}
        <circle
          cx="30%"
          cy="0"
          r="8%"
          fill={
            props.renderData.playerInputs.processed.a ? "green" : "transparent"
          }
          stroke="black"
        />
        {/* B */}
        <circle
          cx="17%"
          cy="-10%"
          r="5%"
          fill={
            props.renderData.playerInputs.processed.b ? "red" : "transparent"
          }
          stroke="black"
        />
        {/* X */}
        <circle
          cx="45%"
          cy="0"
          r="5%"
          fill={
            props.renderData.playerInputs.processed.x
              ? "lightgray"
              : "transparent"
          }
          stroke="black"
        />
        {/* Y */}
        <circle
          cx="29%"
          cy="15%"
          r="5%"
          fill={
            props.renderData.playerInputs.processed.y
              ? "lightgray"
              : "transparent"
          }
          stroke="black"
        />
        {/* L */}
        <rect
          x="-40%"
          y="30%"
          width="20%"
          height="4%"
          fill={
            props.renderData.playerInputs.processed.lTriggerDigial
              ? "lightgray"
              : "transparent"
          }
          stroke="black"
        />
        {/* R */}
        <rect
          x="40%"
          y="30%"
          width="20%"
          height="4%"
          fill={
            props.renderData.playerInputs.processed.rTriggerDigial
              ? "lightgray"
              : "transparent"
          }
          stroke="black"
        />
      </g>
    </svg>
  );
}
