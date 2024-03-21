import { MathUtils } from "three";

import { actions, charactersInt } from "~/common/names";
import type {
  PlayerState,
  PlayerUpdate,
  PlayerUpdateWithNana,
  RenderData,
  ReplayData,
} from "~/common/types";
import { actionMapByInternalId } from "~/viewer/characters";

export function renderCamera(renderData: RenderData[][]) {
  const positions: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }[] = [];
  let lastPosition = { left: -73, right: 73, top: 60, bottom: -60 };

  for (let frame = 0; frame < renderData.length; frame++) {
    const focusPoints = renderData[frame]
      .filter(({ animationName }) => animationName !== "")
      .map(({ playerState }) => ({
        x: playerState.xPosition,
        y: playerState.yPosition,
      }));
    if (focusPoints.length === 0) {
      focusPoints.push({ x: 0, y: 0 });
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const { x, y } of focusPoints) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const width = Math.max(100, maxX - minX + 20);
    const height = Math.max(120, maxY - minY + 20);
    const aspect = 73 / 60;
    const targetWidth = Math.max(width, height * aspect);
    const targetHeight = targetWidth / aspect;
    const smoothness = 0.06;
    positions.push({
      left: MathUtils.lerp(
        lastPosition.left,
        midX - targetWidth / 2,
        smoothness,
      ),
      right: MathUtils.lerp(
        lastPosition.right,
        midX + targetWidth / 2,
        smoothness,
      ),
      top: MathUtils.lerp(
        lastPosition.top,
        midY + targetHeight / 2,
        smoothness,
      ),
      bottom: MathUtils.lerp(
        lastPosition.bottom,
        midY - targetHeight / 2,
        smoothness,
      ),
    });
    lastPosition = positions.at(-1)!;
  }
  return positions;
}

export function renderReplay(replay: ReplayData): RenderData[][] {
  return replay.frames.map((frame) =>
    frame.players
      .filter(Boolean)
      .flatMap((player) =>
        player.nanaState
          ? [
              computeRenderData(replay, player, false),
              computeRenderData(replay, player, true),
            ]
          : [computeRenderData(replay, player, false)],
      ),
  );
}

function computeRenderData(
  replay: ReplayData,
  playerUpdate: PlayerUpdate,
  isNana: boolean,
): RenderData {
  const playerState = (playerUpdate as PlayerUpdateWithNana)[
    isNana ? "nanaState" : "state"
  ];
  const playerInputs = (playerUpdate as PlayerUpdateWithNana)[
    isNana ? "nanaInputs" : "inputs"
  ];
  const playerSettings = replay.settings.playerSettings
    .filter(Boolean)
    .find((settings) => settings.playerIndex === playerUpdate.playerIndex)!;

  const startOfActionPlayerState: PlayerState = (
    getPlayerOnFrame(
      playerUpdate.playerIndex,
      getStartOfAction(playerState, replay),
      replay,
    ) as PlayerUpdateWithNana
  )[isNana ? "nanaState" : "state"];
  const actionName = actions[playerState.actionStateId];
  const characterData = actionMapByInternalId[playerState.internalCharacterId];
  const animationName =
    characterData.animationMap.get(actionName) ??
    characterData.specialsMap.get(playerState.actionStateId) ??
    actionName;
  const rotation =
    animationName === "DamageFlyRoll"
      ? getDamageFlyRollRotation(replay, playerState)
      : isSpacieUpB(playerState)
        ? getSpacieUpBRotation(replay, playerState)
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
  const animationFrame = Math.floor(
    Math.max(0, playerState.actionStateFrameCounter),
  );
  return {
    playerState,
    playerInputs,
    playerSettings,
    characterData,
    animationName,
    animationFrame,
    facingDirection,
    rotation,
    lCancelStatus: startOfActionPlayerState.lCancelStatus,
  };
}

// DamageFlyRoll default rotation is (0,1), but we calculate rotation from (1,0)
// so we need to subtract 90 degrees. Quick checks:
// 0 - 90 = -90 which turns (0,1) into (1,0)
// -90 - 90 = -180 which turns (0,1) into (-1,0)
// Facing direction is handled naturally because the rotation will go the
// opposite direction (that scale happens first) and the flip of (0,1) is still
// (0, 1)
export function getDamageFlyRollRotation(
  replay: ReplayData,
  playerState: PlayerState,
): number {
  const previousState = (
    getPlayerOnFrame(
      playerState.playerIndex,
      playerState.frameNumber - 1,
      replay,
    ) as PlayerUpdateWithNana
  )[playerState.isNana ? "nanaState" : "state"];
  const deltaX = playerState.xPosition - previousState.xPosition;
  const deltaY = playerState.yPosition - previousState.yPosition;
  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI - 90;
}

// Rotation will be whatever direction the player was holding at blastoff. The
// default rotation of the animation is (1,0), so we need to subtract 180 when
// facing left, and subtract 0 when facing right.
// Quick checks:
// 0 - 0 = 0, so (1,0) is unaltered when facing right
// 0 - 180 = -180, so (1,0) is flipped when facing left
export function getSpacieUpBRotation(
  replay: ReplayData,
  playerState: PlayerState,
): number {
  const startOfActionPlayer = getPlayerOnFrame(
    playerState.playerIndex,
    getStartOfAction(playerState, replay),
    replay,
  );
  const joystickDegrees =
    ((startOfActionPlayer.inputs.processed.joystickY === 0 &&
    startOfActionPlayer.inputs.processed.joystickX === 0
      ? Math.PI / 2
      : Math.atan2(
          startOfActionPlayer.inputs.processed.joystickY,
          startOfActionPlayer.inputs.processed.joystickX,
        )) *
      180) /
    Math.PI;
  return (
    joystickDegrees -
    ((startOfActionPlayer as PlayerUpdateWithNana)[
      playerState.isNana ? "nanaState" : "state"
    ].facingDirection === -1
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

export function isSpacieUpB(playerState: PlayerState): boolean {
  const character = charactersInt[playerState.internalCharacterId];
  return (
    ["Fox", "Falco"].includes(character) &&
    [355, 356].includes(playerState.actionStateId)
  );
}

export function getStartOfAction(
  playerState: PlayerState,
  replayData: ReplayData,
): number {
  let earliestStateOfAction = (
    getPlayerOnFrame(
      playerState.playerIndex,
      playerState.frameNumber,
      replayData,
    ) as PlayerUpdateWithNana
  )[playerState.isNana ? "nanaState" : "state"];
  while (true) {
    const testEarlierState = getPlayerOnFrame(
      playerState.playerIndex,
      earliestStateOfAction.frameNumber - 1,
      replayData,
    )?.[playerState.isNana ? "nanaState" : "state"];
    if (
      testEarlierState === undefined ||
      testEarlierState.actionStateId !== earliestStateOfAction.actionStateId ||
      testEarlierState.actionStateFrameCounter >
        earliestStateOfAction.actionStateFrameCounter
    ) {
      return earliestStateOfAction.frameNumber;
    }
    earliestStateOfAction = testEarlierState;
  }
}

export function getPlayerOnFrame(
  playerIndex: number,
  frameNumber: number,
  replayData: ReplayData,
): PlayerUpdate {
  return replayData.frames[frameNumber]?.players[playerIndex];
}
