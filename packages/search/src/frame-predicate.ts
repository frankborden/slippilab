import type { ReplayData, PlayerState } from '@slippilab/common';

export type FramePredicate = (frame: PlayerState, game: ReplayData) => boolean;

export const isGrabbed: FramePredicate = (
  frame: PlayerState,
  _game: ReplayData,
) => frame.actionStateId >= 0xdf && frame.actionStateId <= 0xe8;

export const isInGroundedControl: FramePredicate = (
  frame: PlayerState,
  _game: ReplayData,
) => {
  const id = frame.actionStateId;
  const ground = id >= 0x0e && id <= 0x18;
  const squat = id >= 0x27 && id <= 0x29;
  const groundAttack = id >= 0x2c && id <= 0x40;
  const grab = id === 0xd4;
  return ground || squat || groundAttack || grab;
};

export const isNotInGroundedControl: FramePredicate = (
  frame: PlayerState,
  game: ReplayData,
) => !isInGroundedControl(frame, game);

export const isInHitstun: FramePredicate = (
  frame: PlayerState,
  _game: ReplayData,
) =>
  (frame.actionStateId >= 0x4b && frame.actionStateId <= 0x5b) ||
  frame.actionStateId === 0x26;

export const isInBeginningOfHitstun: FramePredicate = (
  frame: PlayerState,
  game: ReplayData,
) => isInHitstun(frame, game) && frame.actionStateFrameCounter === 1;

export const isInNotBeginningOfHitstun: FramePredicate = (
  frame: PlayerState,
  game: ReplayData,
) => isInHitstun(frame, game) && frame.actionStateFrameCounter === 2;

export const isDead: FramePredicate = (frame: PlayerState, _game: ReplayData) =>
  frame.actionStateId >= 0x00 && frame.actionStateId <= 0x0a;

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
// credit: magus for data/tool, posted by StrongBad in smashboards thread:
// "Stage blast zones via debug mode"
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

export const isOffstage: FramePredicate = (
  frame: PlayerState,
  _game: ReplayData,
) => {
  const currentStageData = stageData[_game.settings.stageId!];
  if (currentStageData === undefined) {
    return false;
  }
  return (
    frame.yPosition! < currentStageData.mainPlatformHeight ||
    frame.xPosition! < currentStageData.leftLedgeX ||
    frame.xPosition! > currentStageData.rightLedgeX
  );
};
