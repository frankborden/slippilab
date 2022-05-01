import { max, modulo } from "rambda";
import { createMemo, createResource, Show } from "solid-js";
import { fetchAnimations } from "./animationCache";
import { actionMapByInternalId } from "./characters";
import {
  actionNameById,
  characterNameByExternalId,
  characterNameByInternalId,
} from "../common/ids";
import { state } from "../state";

interface RenderData {
  path?: string;
  innerColor: string;
  outerColor: string;
  transforms: string[];
}

// TODO: Nana
export function Player(props: { player: number }) {
  const player = createMemo(() =>
    getPlayerOnFrame(props.player, state.frame())
  );
  const playerSettings = createMemo(
    () => state.replayData()!.settings.playerSettings[props.player]
  );
  // For Zelda/Sheik transformations we need to update the external ID to fetch
  // the other one's animations if there is a transformation. Don't bother
  // preloading though because Zelda is not popular.
  const matchingExternalCharacterId = createMemo(() => {
    const internalCharacterName =
      characterNameByInternalId[player().state.internalCharacterId];
    // playerSettings is not updated, it only contains the starting
    // transformation.
    switch (internalCharacterName) {
      case "Zelda":
        return characterNameByExternalId.indexOf("Zelda");
      case "Sheik":
        return characterNameByExternalId.indexOf("Sheik");
      default:
        return playerSettings().externalCharacterId;
    }
  });
  const [animations] = createResource(matchingExternalCharacterId, () =>
    fetchAnimations(matchingExternalCharacterId())
  );
  const renderData = createMemo((): RenderData => {
    const currentPlayerState = player().state;
    const startOfActionPlayerState = getPlayerOnFrame(
      props.player,
      getStartOfAction(props.player, state.frame())
    ).state;
    const actionName = actionNameById[currentPlayerState.actionStateId];
    const characterData =
      actionMapByInternalId[currentPlayerState.internalCharacterId];
    const animationName =
      characterData.animationMap.get(actionName) ??
      characterData.specialsMap.get(currentPlayerState.actionStateId) ??
      actionName;
    const animationFrames = animations()?.[animationName];
    // TODO: validate L cancels & other fractional frames, currently just
    // flooring.
    // Converts - 1 to 0 and loops for Entry, Guard, etc.
    const frameIndex = modulo(
      Math.floor(max(0, currentPlayerState.actionStateFrameCounter)),
      animationFrames?.length ?? 1
    );
    // To save animation file size, duplicate frames just reference earlier
    // matching frames such as "frame20".
    const animationPathOrFrameReference = animationFrames?.[frameIndex];
    const path = animationPathOrFrameReference?.startsWith("frame")
      ? animationFrames?.[
          Number(animationPathOrFrameReference.slice("frame".length))
        ]
      : animationPathOrFrameReference;
    const rotation =
      animationName === "DamageFlyRoll"
        ? getDamageFlyRollRotation(props.player, state.frame())
        : isSpacieUpB(props.player, state.frame())
        ? getSpacieUpBRotation(props.player, state.frame())
        : 0;
    // Some animations naturally turn the player around, but facingDirection
    // updates partway through the animation and incorrectly flips the
    // animation. The solution is to "fix" the facingDirection for the duration
    // of the action, as the animation expects. However upB turnarounds and
    // Jigglypuff/Kirby mid-air jumps are an exception where we need to flip
    // based on the updated state.facingDirection.
    const facingDirection = actionFollowsFacingDirection(animationName)
      ? currentPlayerState.facingDirection
      : startOfActionPlayerState.facingDirection;
    return {
      path,
      // TODO: teams colors and shades
      innerColor: ["darkred", "darkblue", "gold", "darkgreen"][props.player],
      outerColor:
        startOfActionPlayerState.lCancelStatus === "missed"
          ? "red"
          : startOfActionPlayerState.hurtboxCollisionState !== "vulnerable"
          ? "blue"
          : "none",
      transforms: [
        `translate(${currentPlayerState.xPosition} ${
          player().state.yPosition
        })`,
        // TODO: rotate around true character center instead of current guessed
        // center of position+(0,8)
        `rotate(${rotation} 0 8)`,
        `scale(${characterData.scale} ${characterData.scale})`,
        `scale(${facingDirection} 1)`,
        `scale(.1 -.1) translate(-500 -500)`,
      ],
    };
  });

  return (
    <>
      <Show when={animations()}>
        <path
          transform={renderData().transforms.join(" ")}
          d={renderData().path}
          fill={renderData().innerColor}
          stroke-width={2}
          stroke={renderData().outerColor}
        ></path>
        {/* TODO: Shield, Shine */}
      </Show>
    </>
  );
}

// DamageFlyRoll default rotation is (0,1), but we calculate rotation from (1,0)
// so we need to subtract 90 degrees. Quick checks:
// 0 - 90 = -90 which turns (0,1) into (1,0)
// -90 - 90 = -180 which turns (0,1) into (-1,0)
// Facing direction is handled naturally because the rotation will go the
// opposite direction (that scale happens first) and the flip of (0,1) is still
// (0, 1)
function getDamageFlyRollRotation(
  playerIndex: number,
  frameNumber: number
): number {
  const currentState = getPlayerOnFrame(playerIndex, frameNumber).state;
  const previousState = getPlayerOnFrame(playerIndex, frameNumber - 1).state;
  const deltaX = currentState.xPosition - previousState.xPosition;
  const deltaY = currentState.yPosition - previousState.yPosition;
  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI - 90;
}

function getStartOfAction(playerIndex: number, currentFrame: number): number {
  let earliestStateOfAction = getPlayerOnFrame(playerIndex, currentFrame).state;
  while (true) {
    const testEarlierState = getPlayerOnFrame(
      playerIndex,
      earliestStateOfAction.frameNumber - 1
    )?.state;
    if (
      testEarlierState === undefined ||
      testEarlierState.actionStateId !== earliestStateOfAction.actionStateId
    ) {
      return earliestStateOfAction.frameNumber;
    }
    earliestStateOfAction = testEarlierState;
  }
}

// All jumps and upBs either 1) Need to follow the current frame's
// facingDirection, or 2) Won't have facingDirection change during the action.
// In either case we can grab the facingDirection from the current frame.
function actionFollowsFacingDirection(animationName: string): boolean {
  return (
    animationName.includes("Jump") ||
    ["SpecialHi", "SpecialAirHi"].includes(animationName)
  );
}

// Rotation will be whatever direction the player was holding at blastoff. The
// default rotation of the animation is (1,0), so we need to subtract 180 when
// facing left, and subtract 0 when facing right.
// Quick checks:
// 0 - 0 = 0, so (1,0) is unaltered when facing right
// 0 - 180 = -180, so (1,0) is flipped when facing left
function getSpacieUpBRotation(
  playerIndex: number,
  currentFrame: number
): number {
  const startOfActionPlayer = getPlayerOnFrame(
    playerIndex,
    getStartOfAction(playerIndex, currentFrame)
  );
  const joystickDegrees =
    (Math.atan2(
      startOfActionPlayer.inputs.processed.joystickY,
      startOfActionPlayer.inputs.processed.joystickX
    ) *
      180) /
    Math.PI;
  return (
    joystickDegrees -
    (startOfActionPlayer.state.facingDirection === -1 ? 180 : 0)
  );
}

function getPlayerOnFrame(playerIndex: number, frameNumber: number) {
  return state.replayData()!.frames[frameNumber]?.players[playerIndex];
}

function isSpacieUpB(playerIndex: number, frameNumber: number) {
  const state = getPlayerOnFrame(playerIndex, frameNumber).state;
  const character = characterNameByInternalId[state.internalCharacterId];
  return (
    ["Fox", "Falco"].includes(character) &&
    [355, 356].includes(state.actionStateId)
  );
}
