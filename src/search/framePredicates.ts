import { actionNameById, attackNamesById } from "~/common/ids";
import type { ActionName, AttackName } from "~/common/ids";
import type { ReplayData } from "~/common/types";

export type Predicate = (
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
) => boolean;

interface StageData {
  name: string;
  leftXBoundary: number;
  rightXBoundary: number;
  upperYBoundary: number;
  lowerYBoundary: number;
  mainPlatformHeight: number;
  sidePlatformHeight?: number;
  topPlatformHeight?: number;
  leftLedgeX: number;
  rightLedgeX: number;
}
/**
 * Source: http://smashboards.com/posts/18643652, spot checked using HSDraw
 */
const stageData: { [stageId: number]: StageData } = {
  2: {
    name: "Fountain of Dreams",
    leftXBoundary: -198.75,
    rightXBoundary: 198.75,
    upperYBoundary: 202.5,
    lowerYBoundary: -146.25,
    mainPlatformHeight: 0, // grassy sides are raised at 0.6214
    sidePlatformHeight: 27.375, // moves up and down
    topPlatformHeight: 42.75,
    leftLedgeX: -63.35,
    rightLedgeX: 63.35,
  },
  3: {
    name: "Pokemon Stadium", // transforms, no top
    leftXBoundary: -230,
    rightXBoundary: 230,
    upperYBoundary: 180,
    lowerYBoundary: -111,
    mainPlatformHeight: 0, // just a good guess
    sidePlatformHeight: 25,
    leftLedgeX: -87.75,
    rightLedgeX: 87.75,
  },
  8: {
    name: "Yoshi's Story",
    leftXBoundary: -175.7,
    rightXBoundary: 173.6,
    upperYBoundary: 168,
    lowerYBoundary: -91,
    mainPlatformHeight: 0, // has slopes
    sidePlatformHeight: 23.45,
    topPlatformHeight: 42,
    leftLedgeX: -56,
    rightLedgeX: 56,
  },
  28: {
    name: "Dream Land N64",
    leftXBoundary: -255,
    rightXBoundary: 255,
    upperYBoundary: 250,
    lowerYBoundary: -123,
    mainPlatformHeight: 0.01,
    sidePlatformHeight: 30.2425,
    topPlatformHeight: 51.4264,
    leftLedgeX: -77.27,
    rightLedgeX: 77.27,
  },
  31: {
    name: "Battlefield",
    leftXBoundary: -224,
    rightXBoundary: 224,
    upperYBoundary: 200,
    lowerYBoundary: -108.8,
    mainPlatformHeight: 0,
    sidePlatformHeight: 27.2,
    topPlatformHeight: 54.4,
    leftLedgeX: -68.4,
    rightLedgeX: 68.4,
  },
  32: {
    name: "Final Destination", // no side/top
    leftXBoundary: -246,
    rightXBoundary: 246,
    upperYBoundary: 188,
    lowerYBoundary: -140,
    mainPlatformHeight: 0,
    leftLedgeX: -85.5606,
    rightLedgeX: 85.5606,
  },
};

export function isGrabbed(
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
): boolean {
  const state = replay.frames[frameNumber].players[playerIndex]?.state;
  if (state === undefined) {
    return true;
  }
  const actionStateId = state.actionStateId;
  return actionStateId >= 0xdf && actionStateId <= 0xe8;
}

export function isInGroundedControl(
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
): boolean {
  const state = replay.frames[frameNumber].players[playerIndex]?.state;
  if (state === undefined) {
    return true;
  }
  const actionStateId = state.actionStateId;
  const ground = actionStateId >= 0x0e && actionStateId <= 0x18;
  const squat = actionStateId >= 0x27 && actionStateId <= 0x29;
  const groundAttack = actionStateId >= 0x2c && actionStateId <= 0x40;
  const grab = actionStateId === 0xd4;
  return ground || squat || groundAttack || grab;
}

export function isInHitstun(
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
): boolean {
  const state = replay.frames[frameNumber].players[playerIndex]?.state;
  if (state === undefined) {
    return false;
  }
  const actionStateId = state.actionStateId;
  return (
    (actionStateId >= 0x4b && actionStateId <= 0x5b) || actionStateId === 0x26
  );
}

export function isGrounded(
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
): boolean {
  const state = replay.frames[frameNumber].players[playerIndex]?.state;
  if (state === undefined) {
    return false;
  }
  return state.isGrounded;
}

export function isOpponentCloserToCenter(
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
): boolean {
  const state = replay.frames[frameNumber].players[playerIndex]?.state;
  if (state === undefined) {
    return false;
  }
  const otherPlayerIndex = replay.frames[frameNumber].players
    .filter((p) => p)
    .find((p) => p.playerIndex !== playerIndex)?.playerIndex;
  if (otherPlayerIndex === undefined) {
    return false;
  }
  const otherPlayerState =
    replay.frames[frameNumber].players[otherPlayerIndex]?.state;
  return Math.abs(state.xPosition) - Math.abs(otherPlayerState.xPosition) > 0;
}

export function isMissedLCancel(
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
): boolean {
  const state = replay.frames[frameNumber].players[playerIndex]?.state;
  if (state === undefined) {
    return false;
  }
  return state.lCancelStatus === "missed";
}

export function isDead(
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
): boolean {
  const state = replay.frames[frameNumber].players[playerIndex]?.state;
  if (state === undefined) {
    return true;
  }
  const actionStateId = state.actionStateId;
  return actionStateId >= 0x00 && actionStateId <= 0x0a;
}
export function isOffstage(
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData
): boolean {
  const currentStageData = stageData[replay.settings.stageId];
  if (currentStageData === undefined) {
    return false;
  }
  const state = replay.frames[frameNumber].players[playerIndex]?.state;
  if (state === undefined) {
    return false;
  }
  /**
   * Positions during thrown actions are untrustworthy. The game ignores
   * throwee's position and dynamically attaches throwee's bones to thrower's
   * bones for smooth animation.
   */
  const actionName = actionNameById[state.actionStateId];
  if (actionName?.startsWith("Thrown")) {
    return false;
  }
  /**
   * Sometimes positions can clip through the main platform a bit before players
   * land and so give 10 leeway.
   */
  return (
    state.yPosition <= currentStageData.mainPlatformHeight - 10 ||
    state.xPosition <= currentStageData.leftLedgeX ||
    state.xPosition >= currentStageData.rightLedgeX
  );
}

export function action(actionName: ActionName): Predicate {
  return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
    const actionStateId =
      replay.frames[frameNumber].players[playerIndex]?.state.actionStateId;
    if (actionStateId === undefined) {
      return false;
    }
    return actionNameById[actionStateId] === actionName;
  };
}

export function actionStartsWith(actionName: string): Predicate {
  return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
    const actionStateId =
      replay.frames[frameNumber].players[playerIndex]?.state.actionStateId;
    if (actionStateId === undefined) {
      return false;
    }
    return actionNameById[actionStateId]?.startsWith(actionName);
  };
}

export function landsAttack(attackName: AttackName): Predicate {
  return all(
    opponent(isInHitstun),
    (playerIndex, frameNumber, replay) =>
      attackNamesById[
        replay.frames[frameNumber].players[playerIndex]?.state
          .lastHittingAttackId
      ] === attackName
  );
}

// TODO: work in doubles
export function opponent(predicate: Predicate): Predicate {
  return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
    const otherPlayerIndex = replay.frames[frameNumber].players
      .filter((p) => p)
      .find((p) => p.playerIndex !== playerIndex)?.playerIndex;
    if (otherPlayerIndex === undefined) {
      return false;
    }
    return predicate(otherPlayerIndex, frameNumber, replay);
  };
}

export function either(...predicates: Predicate[]): Predicate {
  return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
    return predicates.some((predicate) =>
      predicate(playerIndex, frameNumber, replay)
    );
  };
}

export function all(...predicates: Predicate[]): Predicate {
  return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
    return predicates.every((predicate) =>
      predicate(playerIndex, frameNumber, replay)
    );
  };
}

export function not(...predicates: Predicate[]): Predicate {
  return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
    return !predicates.some((predicate) =>
      predicate(playerIndex, frameNumber, replay)
    );
  };
}
