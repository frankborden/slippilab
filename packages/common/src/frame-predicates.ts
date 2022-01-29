import type { ReplayData } from './replay-data';

export type Predicate = (
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData,
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
    name: 'Fountain of Dreams',
    leftXBoundary: -198.75,
    rightXBoundary: 198.75,
    upperYBoundary: 202.5,
    lowerYBoundary: -146.25,
    mainPlatformHeight: 0.6214, // grassy sides are raised
    sidePlatformHeight: 27.375, // moves up and down
    topPlatformHeight: 42.75,
    leftLedgeX: -63.35,
    rightLedgeX: 63.35,
  },
  3: {
    name: 'Pokemon Stadium', // transforms, no top
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
    name: 'Dream Land N64',
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
    name: 'Battlefield',
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
    name: 'Final Destination', // no side/top
    leftXBoundary: -246,
    rightXBoundary: 246,
    upperYBoundary: 188,
    lowerYBoundary: -140,
    mainPlatformHeight: 0,
    leftLedgeX: -85.5606,
    rightLedgeX: 85.5606,
  },
};

export const framePredicates = {
  isGrabbed: (playerIndex: number, frameNumber: number, replay: ReplayData) => {
    const state = replay.frames[frameNumber].players[playerIndex]?.state;
    if (state === undefined) {
      return true;
    }
    const actionStateId = state.actionStateId;
    return actionStateId >= 0xdf && actionStateId <= 0xe8;
  },

  isInGroundedControl: (
    playerIndex: number,
    frameNumber: number,
    replay: ReplayData,
  ) => {
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
  },

  isInHitstun: (
    playerIndex: number,
    frameNumber: number,
    replay: ReplayData,
  ) => {
    const state = replay.frames[frameNumber].players[playerIndex]?.state;
    if (state === undefined) {
      return false;
    }
    const actionStateId = state.actionStateId;
    return (
      (actionStateId >= 0x4b && actionStateId <= 0x5b) || actionStateId === 0x26
    );
  },

  isDead: (playerIndex: number, frameNumber: number, replay: ReplayData) => {
    const state = replay.frames[frameNumber].players[playerIndex]?.state;
    if (state === undefined) {
      return true;
    }
    const actionStateId = state.actionStateId;
    return actionStateId >= 0x00 && actionStateId <= 0x0a;
  },
  isOffstage: (
    playerIndex: number,
    frameNumber: number,
    replay: ReplayData,
  ) => {
    const currentStageData = stageData[replay.settings.stageId];
    if (currentStageData === undefined) {
      return false;
    }
    const state = replay.frames[frameNumber].players[playerIndex]?.state;
    if (state === undefined) {
      return false;
    }
    return (
      state.yPosition! < currentStageData.mainPlatformHeight ||
      state.xPosition! < currentStageData.leftLedgeX ||
      state.xPosition! > currentStageData.rightLedgeX
    );
  },

  either: (...predicates: Predicate[]): Predicate => {
    return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
      return predicates.some((predicate) =>
        predicate(playerIndex, frameNumber, replay),
      );
    };
  },

  all: (...predicates: Predicate[]): Predicate => {
    return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
      return predicates.every((predicate) =>
        predicate(playerIndex, frameNumber, replay),
      );
    };
  },

  not: (...predicates: Predicate[]): Predicate => {
    return (playerIndex: number, frameNumber: number, replay: ReplayData) => {
      return !predicates.some((predicate) =>
        predicate(playerIndex, frameNumber, replay),
      );
    };
  },
};
