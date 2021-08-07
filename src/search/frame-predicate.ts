import {
  PostFrameUpdateType,
  SlippiGame,
  isDamaged,
  isInControl,
  isDead as slippiIsDead,
  isGrabbed as slippiIsGrabbed,
} from '@slippi/slippi-js';

export type FramePredicate = (
  frame: PostFrameUpdateType,
  game: SlippiGame,
) => boolean;

export const isGrabbed: FramePredicate = (
  frame: PostFrameUpdateType,
  _game: SlippiGame,
) => {
  return slippiIsGrabbed(frame.actionStateId!);
};

export const isInGroundedControl: FramePredicate = (
  frame: PostFrameUpdateType,
  _game: SlippiGame,
) => {
  return isInControl(frame.actionStateId!);
};

export const isNotInGroundedControl: FramePredicate = (
  frame: PostFrameUpdateType,
  _game: SlippiGame,
) => {
  return !isInControl(frame.actionStateId!);
};

export const isInHitstun: FramePredicate = (
  frame: PostFrameUpdateType,
  _game: SlippiGame,
) => {
  return isDamaged(frame.actionStateId!);
};

export const isInBeginningOfHitstun: FramePredicate = (
  frame: PostFrameUpdateType,
  _game: SlippiGame,
) => {
  return isDamaged(frame.actionStateId!) && frame.actionStateCounter === 1;
};

export const isInNotBeginningOfHitstun: FramePredicate = (
  frame: PostFrameUpdateType,
  _game: SlippiGame,
) => {
  return isDamaged(frame.actionStateId!) && frame.actionStateCounter === 2;
};

export const isDead: FramePredicate = (
  frame: PostFrameUpdateType,
  _game: SlippiGame,
) => {
  return slippiIsDead(frame.actionStateId!);
};

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
  frame: PostFrameUpdateType,
  _game: SlippiGame,
) => {
  const currentStageData = stageData[_game.getSettings()!.stageId!];
  if (currentStageData === undefined) {
    return false;
  }
  return (
    frame.positionY! < currentStageData.mainPlatformHeight ||
    frame.positionX! < currentStageData.leftLedgeX ||
    frame.positionX! > currentStageData.rightLedgeX
  );
};
