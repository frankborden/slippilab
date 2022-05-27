import { modulo, max } from "rambda";
import { createEffect, createMemo, createResource } from "solid-js";
import {
  actionNameById,
  characterNameByExternalId,
  characterNameByInternalId,
} from "../common/ids";
import { PlayerUpdate } from "../common/types";
import { frame, store } from "../state";
import { CharacterAnimations, fetchAnimations } from "./animationCache";
import { actionMapByInternalId } from "./characters";
import { Character } from "./characters/character";
import { teamColors, playerColors } from "./colors";
import { getPlayerOnFrame, getStartOfAction } from "./viewerUtil";

export interface RenderData {
  playerUpdate: PlayerUpdate;
  isNana: boolean;

  // main render
  path?: string;
  innerColor: string;
  outerColor: string;
  transforms: string[];

  // shield/shine renders
  animationName: string;
  position: [number, number];
  characterData: Character;
}

const playerUpdates = createMemo(
  () => store.replayData?.frames[frame()].players.filter(p => p) ?? []
);

export const playerSettings = createMemo(
  () => store.replayData?.settings.playerSettings.filter(p => p) ?? []
);

// For Zelda/Sheik transformations we need to update the external ID to fetch
// the other one's animations if there is a transformation. Don't bother
// preloading though because Zelda is not popular.
function adjustExternalCharacterId(
  externalCharacterId: number,
  internalCharacterId: number
) {
  const internalCharacterName = characterNameByInternalId[internalCharacterId];
  // playerSettings is not updated, it only contains the starting
  // transformation.
  switch (internalCharacterName) {
    case "Zelda":
      return characterNameByExternalId.indexOf("Zelda");
    case "Sheik":
      return characterNameByExternalId.indexOf("Sheik");
    default:
      return externalCharacterId;
  }
}

const adjustedExternalCharacterIds = createMemo(() =>
  playerSettings().map(settings =>
    playerUpdates()[settings.playerIndex]
      ? adjustExternalCharacterId(
          settings.externalCharacterId,
          playerUpdates()[settings.playerIndex].state.internalCharacterId
        )
      : settings.externalCharacterId
  )
);

const animationsByPlayerIndex = Array.from(Array(4).keys()).map(
  i =>
    createResource(
      () => playerSettings().find(p => p.playerIndex === i),
      () =>
        fetchAnimations(
          adjustedExternalCharacterIds()[
            playerSettings().findIndex(p => p.playerIndex === i)
          ]
        )
    )[0]
);

export const renderDatas = createMemo(() => {
  return playerUpdates().flatMap(u => {
    if (!animationsByPlayerIndex[u.playerIndex]) return [];
    const renderDatas = [];
    renderDatas.push(
      computeRenderData(
        u.playerIndex,
        u,
        animationsByPlayerIndex[u.playerIndex](),
        false
      )
    );
    if (u.nanaState) {
      renderDatas.push(
        computeRenderData(
          u.playerIndex,
          u,
          animationsByPlayerIndex[u.playerIndex](),
          true
        )
      );
    }
    return renderDatas;
  });
});

createEffect(() => console.log(renderDatas()));

function computeRenderData(
  playerIndex: number,
  playerUpdate: PlayerUpdate,
  animations: CharacterAnimations | undefined,
  isNana: boolean
): RenderData {
  const playerState = playerUpdate[isNana ? "nanaState" : "state"]!;
  const startOfActionPlayerState = getPlayerOnFrame(
    playerIndex,
    getStartOfAction(playerIndex, frame(), isNana, store.replayData!),
    store.replayData!
  )[isNana ? "nanaState" : "state"]!;
  const actionName = actionNameById[playerState.actionStateId];

  const characterData = actionMapByInternalId[playerState.internalCharacterId];
  const animationName =
    characterData.animationMap.get(actionName) ??
    characterData.specialsMap.get(playerState.actionStateId) ??
    actionName;
  const animationFrames = animations?.[animationName];
  // TODO: validate L cancels & other fractional frames, currently just
  // flooring.
  // Converts - 1 to 0 and loops for Entry, Guard, etc.
  const frameIndex = modulo(
    Math.floor(max(0, playerState.actionStateFrameCounter)),
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
      ? getDamageFlyRollRotation(playerIndex, frame(), isNana)
      : isSpacieUpB(playerIndex, frame(), isNana)
      ? getSpacieUpBRotation(playerIndex, frame(), isNana)
      : 0;
  // Some animations naturally turn the player around, but facingDirection
  // updates partway through the animation and incorrectly flips the
  // animation. The solution is to "fix" the facingDirection for the duration
  // of the action, as the animation expects. However upB turnarounds and
  // Jigglypuff/Kirby mid-air jumps are an exception where we need to flip
  // based on the updated state.facingDirection.
  const facingDirection = actionFollowsFacingDirection(animationName)
    ? playerState.facingDirection
    : startOfActionPlayerState.facingDirection;
  return {
    playerUpdate: playerUpdate,
    isNana: isNana,
    path,
    innerColor: getPlayerColor(playerIndex),
    outerColor:
      startOfActionPlayerState.lCancelStatus === "missed"
        ? "red"
        : playerState.hurtboxCollisionState !== "vulnerable"
        ? "blue"
        : "black",
    transforms: [
      `translate(${playerState.xPosition} ${playerState.yPosition})`,
      // TODO: rotate around true character center instead of current guessed
      // center of position+(0,8)
      `rotate(${rotation} 0 8)`,
      `scale(${characterData.scale} ${characterData.scale})`,
      `scale(${facingDirection} 1)`,
      `scale(.1 -.1) translate(-500 -500)`,
    ],
    animationName: animationName,
    position: [playerState.xPosition, playerState.yPosition],
    characterData: characterData,
  };
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
  frameNumber: number,
  isNana: boolean
): number {
  const currentState = getPlayerOnFrame(
    playerIndex,
    frameNumber,
    store.replayData!
  )[isNana ? "nanaState" : "state"]!;
  const previousState = getPlayerOnFrame(
    playerIndex,
    frameNumber - 1,
    store.replayData!
  )[isNana ? "nanaState" : "state"]!;
  const deltaX = currentState.xPosition - previousState.xPosition;
  const deltaY = currentState.yPosition - previousState.yPosition;
  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI - 90;
}

// Rotation will be whatever direction the player was holding at blastoff. The
// default rotation of the animation is (1,0), so we need to subtract 180 when
// facing left, and subtract 0 when facing right.
// Quick checks:
// 0 - 0 = 0, so (1,0) is unaltered when facing right
// 0 - 180 = -180, so (1,0) is flipped when facing left
function getSpacieUpBRotation(
  playerIndex: number,
  currentFrame: number,
  isNana: boolean
): number {
  const startOfActionPlayer = getPlayerOnFrame(
    playerIndex,
    getStartOfAction(playerIndex, currentFrame, isNana, store.replayData!),
    store.replayData!
  );
  const joystickDegrees =
    ((startOfActionPlayer.inputs.processed.joystickY === 0 &&
    startOfActionPlayer.inputs.processed.joystickX === 0
      ? Math.PI / 2
      : Math.atan2(
          startOfActionPlayer.inputs.processed.joystickY,
          startOfActionPlayer.inputs.processed.joystickX
        )) *
      180) /
    Math.PI;
  return (
    joystickDegrees -
    (startOfActionPlayer[isNana ? "nanaState" : "state"]!.facingDirection === -1
      ? 180
      : 0)
  );
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

function isSpacieUpB(
  playerIndex: number,
  frameNumber: number,
  isNana: boolean
) {
  const state = getPlayerOnFrame(playerIndex, frameNumber, store.replayData!)[
    isNana ? "nanaState" : "state"
  ]!;
  const character = characterNameByInternalId[state.internalCharacterId];
  return (
    ["Fox", "Falco"].includes(character) &&
    [355, 356].includes(state.actionStateId)
  );
}

function getPlayerColor(playerIndex: number) {
  if (store.replayData!.settings.isTeams) {
    const teamId =
      store.replayData!.settings.playerSettings[playerIndex].teamId;
    return teamColors[teamId];
  }
  return playerColors[playerIndex];
}
