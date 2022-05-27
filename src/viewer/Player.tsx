import { createMemo, For, Show } from "solid-js";
import { characterNameByExternalId } from "../common/ids";
import { store } from "../state";
import { PlayerUpdate } from "../common/types";
import "./viewerState";
import { RenderData, renderDatas } from "./viewerState";
import { getPlayerOnFrame, getStartOfAction } from "./viewerUtil";

export function Players() {
  return (
    <>
      <For each={renderDatas()}>
        {(renderData) => (
          <>
            <path
              transform={renderData.transforms.join(" ")}
              d={renderData.path}
              fill={renderData.innerColor}
              stroke-width={2}
              stroke={renderData.outerColor}
            ></path>
            <Shield
              renderData={renderData}
              playerUpdate={renderData.playerUpdate}
              isNana={renderData.isNana}
            />
            <Shine
              renderData={renderData}
              playerUpdate={renderData.playerUpdate}
            />
          </>
        )}
      </For>
    </>
  );
}

function Shield(props: {
  renderData: RenderData;
  playerUpdate: PlayerUpdate;
  isNana: boolean;
}) {
  // [0,60]
  const shieldHealth = createMemo(
    () => props.playerUpdate[props.isNana ? "nanaState" : "state"]!.shieldSize
  );
  // [0,1]. If 0 is received, set to 1 because user may have released shield
  // during a Guard-related animation. As an example, a shield must stay active
  // for 8 frames minimum before it is dropped even if the player releases the
  // trigger early.
  // For GuardDamage the shield strength is fixed and ignores trigger updates,
  // so we must walk back to the first frame of stun and read trigger there.
  const triggerStrength = createMemo(() =>
    props.renderData.animationName === "GuardDamage"
      ? getPlayerOnFrame(
          props.playerUpdate.playerIndex,
          getStartOfAction(
            props.playerUpdate.playerIndex,
            props.playerUpdate.frameNumber,
            props.isNana,
            store.replayData!
          ),
          store.replayData!
        ).inputs.processed.anyTrigger
      : props.playerUpdate.inputs.processed.anyTrigger || 1
  );
  // Formulas from https://www.ssbwiki.com/Shield#Shield_statistics
  const triggerStrengthMultiplier = createMemo(
    () => 1 - (0.5 * (triggerStrength() - 0.3)) / 0.7
  );
  const shieldSizeMultiplier = createMemo(
    () => ((shieldHealth() * triggerStrengthMultiplier()) / 60) * 0.85 + 0.15
  );
  return (
    <>
      <Show
        when={["GuardOn", "Guard", "GuardReflect", "GuardDamage"].includes(
          props.renderData.animationName
        )}
      >
        <circle
          // TODO: shield tilts
          cx={
            props.renderData.position[0] +
            props.renderData.characterData.shieldOffset[0] *
              props.playerUpdate[props.isNana ? "nanaState" : "state"]!
                .facingDirection
          }
          cy={
            props.renderData.position[1] +
            props.renderData.characterData.shieldOffset[1]
          }
          r={props.renderData.characterData.shieldSize * shieldSizeMultiplier()}
          fill={props.renderData.innerColor}
          opacity={0.6}
        ></circle>
      </Show>
    </>
  );
}

function Shine(props: { renderData: RenderData; playerUpdate: PlayerUpdate }) {
  const characterName = createMemo(
    () =>
      characterNameByExternalId[
        store.replayData!.settings.playerSettings[
          props.playerUpdate.playerIndex
        ].externalCharacterId
      ]
  );
  return (
    <>
      <Show
        when={
          ["Fox", "Falco"].includes(characterName()) &&
          (props.renderData.animationName.includes("SpecialLw") ||
            props.renderData.animationName.includes("SpecialAirLw"))
        }
      >
        <Hexagon
          x={props.renderData.position[0]}
          // TODO get true shine position, shieldY * 3/4 is a guess.
          y={
            props.renderData.position[1] +
            (props.renderData.characterData.shieldOffset[1] * 3) / 4
          }
          r={6}
        ></Hexagon>
      </Show>
    </>
  );
}

function Hexagon(props: { x: number; y: number; r: number }) {
  const hexagonHole = 0.6;
  const sideX = Math.sin((2 * Math.PI) / 6);
  const sideY = 0.5;
  const offsets = [
    [0, 1],
    [sideX, sideY],
    [sideX, -sideY],
    [0, -1],
    [-sideX, -sideY],
    [-sideX, sideY],
  ];
  const points = createMemo(() =>
    offsets
      .map(([xOffset, yOffset]) =>
        [props.r * xOffset + props.x, props.r * yOffset + props.y].join(",")
      )
      .join(",")
  );
  const maskPoints = createMemo(() =>
    offsets
      .map(([xOffset, yOffset]) =>
        [
          props.r * xOffset * hexagonHole + props.x,
          props.r * yOffset * hexagonHole + props.y,
        ].join(",")
      )
      .join(",")
  );
  return (
    <>
      <defs>
        <mask id="innerHexagon">
          <polygon points={points()} fill="white"></polygon>
          <polygon points={maskPoints()} fill="black"></polygon>
        </mask>
      </defs>
      <polygon
        points={points()}
        fill="#8abce9"
        mask="url(#innerHexagon)"
      ></polygon>
    </>
  );
}
