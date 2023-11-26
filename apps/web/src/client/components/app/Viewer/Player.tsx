import cn from "clsx";
import { type Resource, Show, createMemo } from "solid-js";

import { type CharacterAnimations } from "~/client/components/app/Viewer/animationCache";
import {
  defaultOutlineStrokeColor,
  getPlayerColor,
  invincibleOutlineStrokeColor,
  missedLCancelOutlineStrokeColor,
  shineFillColor,
} from "~/client/components/app/Viewer/colors";
import { charactersExt } from "~/common/model/names";
import {
  type PlayerState,
  type PlayerUpdateWithNana,
  type RenderData,
  type ReplayData,
} from "~/common/model/types";
import {
  getDamageFlyRollRotation,
  getPlayerOnFrame,
  getSpacieUpBRotation,
  getStartOfAction,
  isSpacieUpB,
} from "~/common/render";

export function Player(props: {
  replay: ReplayData;
  player: RenderData;
  animations: Resource<CharacterAnimations | undefined>;
}) {
  const outerStrokeColor = createMemo(() => {
    const startOfActionPlayerState: PlayerState = (
      getPlayerOnFrame(
        props.player.playerState.playerIndex,
        getStartOfAction(props.player.playerState, props.replay!),
        props.replay!,
      ) as PlayerUpdateWithNana
    )[props.player.playerState.isNana ? "nanaState" : "state"];
    return startOfActionPlayerState.lCancelStatus === "missed"
      ? missedLCancelOutlineStrokeColor
      : props.player.playerState.hurtboxCollisionState !== "vulnerable"
        ? invincibleOutlineStrokeColor
        : defaultOutlineStrokeColor;
  });
  const path = createMemo(() => {
    const animationFrames = props.animations()?.[props.player.animationName];
    const animationPathOrFrameReference =
      animationFrames?.[props.player.animationFrame % animationFrames.length];
    return animationPathOrFrameReference !== undefined &&
      (animationPathOrFrameReference.startsWith("frame") ?? false)
      ? animationFrames?.[
          Number(animationPathOrFrameReference.slice("frame".length))
        ]
      : animationPathOrFrameReference;
  });
  const transform = createMemo(() => {
    const rotation =
      props.player.animationName === "DamageFlyRoll"
        ? getDamageFlyRollRotation(props.replay!, props.player.playerState)
        : isSpacieUpB(props.player.playerState)
          ? getSpacieUpBRotation(props.replay!, props.player.playerState)
          : 0;
    return [
      `translate(${props.player.playerState.xPosition} ${props.player.playerState.yPosition})`,
      // TODO: rotate around true character center instead of current guessed
      // center of position+(0,8)
      `rotate(${rotation} 0 8)`,
      `scale(${props.player.characterData.scale} ${props.player.characterData.scale})`,
      `scale(${props.player.facingDirection} 1)`,
      "scale(.1 -.1) translate(-500 -500)",
    ].join(" ");
  });
  return (
    <>
      <path
        transform={transform()}
        d={path()}
        class={cn(
          getPlayerColor(
            props.replay!,
            props.player.playerState.playerIndex,
            props.player.playerState.isNana,
          ),
          outerStrokeColor(),
        )}
        stroke-width={2}
      />
      <Shield replay={props.replay} renderData={props.player} />
      <Shine renderData={props.player} />
    </>
  );
}

function Shield(props: { replay: ReplayData; renderData: RenderData }) {
  // [0,60]
  const shieldHealth = createMemo(
    () => props.renderData.playerState.shieldSize,
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
          props.renderData.playerSettings.playerIndex,
          getStartOfAction(props.renderData.playerState, props.replay!),
          props.replay!,
        ).inputs.processed.anyTrigger
      : props.renderData.playerInputs.processed.anyTrigger === 0
        ? 1
        : props.renderData.playerInputs.processed.anyTrigger,
  );
  // Formulas from https://www.ssbwiki.com/Shield#Shield_statistics
  const triggerStrengthMultiplier = createMemo(
    () => 1 - (0.5 * (triggerStrength() - 0.3)) / 0.7,
  );
  const shieldSizeMultiplier = createMemo(
    () => ((shieldHealth() * triggerStrengthMultiplier()) / 60) * 0.85 + 0.15,
  );
  return (
    <>
      <Show
        when={["GuardOn", "Guard", "GuardReflect", "GuardDamage"].includes(
          props.renderData.animationName,
        )}
      >
        <circle
          // TODO: shield tilts
          cx={
            props.renderData.playerState.xPosition +
            props.renderData.characterData.shieldOffset[0] *
              props.renderData.playerState.facingDirection
          }
          cy={
            props.renderData.playerState.yPosition +
            props.renderData.characterData.shieldOffset[1]
          }
          r={props.renderData.characterData.shieldSize * shieldSizeMultiplier()}
          class={cn(
            getPlayerColor(
              props.replay!,
              props.renderData.playerState.playerIndex,
              props.renderData.playerState.isNana,
            ),
          )}
          opacity={0.6}
        />
      </Show>
    </>
  );
}

function Shine(props: { renderData: RenderData }) {
  const characterName = createMemo(
    () => charactersExt[props.renderData.playerSettings.externalCharacterId],
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
          x={props.renderData.playerState.xPosition}
          // TODO get true shine position, shieldY * 3/4 is a guess.
          y={
            props.renderData.playerState.yPosition +
            (props.renderData.characterData.shieldOffset[1] * 3) / 4
          }
          r={6}
        />
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
        [props.r * xOffset + props.x, props.r * yOffset + props.y].join(","),
      )
      .join(","),
  );
  const maskPoints = createMemo(() =>
    offsets
      .map(([xOffset, yOffset]) =>
        [
          props.r * xOffset * hexagonHole + props.x,
          props.r * yOffset * hexagonHole + props.y,
        ].join(","),
      )
      .join(","),
  );
  return (
    <>
      <defs>
        <mask id="innerHexagon">
          <polygon points={points()} fill="white" />
          <polygon points={maskPoints()} fill="black" />
        </mask>
      </defs>
      <polygon
        points={points()}
        class={cn(shineFillColor)}
        mask="url(#innerHexagon)"
      />
    </>
  );
}
