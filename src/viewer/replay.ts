import type {
  FrameEntryType,
  FramesType,
  PlayerType,
  PostFrameUpdateType,
} from '@slippi/slippi-js';
import { isOneIndexed, animationNameByActionId } from './animations';
import {
  CharacterName,
  characterNamesByInternalId,
  DeepRequired,
} from './common';

export const isInFrame = (
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
): boolean => {
  return Boolean(frame.players[player.playerIndex]);
};

export const getFirstFrameOfAnimation = (
  playerFrame: DeepRequired<PostFrameUpdateType>,
  frames: DeepRequired<FramesType>,
): DeepRequired<PostFrameUpdateType> => {
  let frameIndex = playerFrame.frame - 1;
  let pastConfirmedFrame = playerFrame;
  let pastFrameToCheck =
    frames[frameIndex]?.players?.[playerFrame.playerIndex]?.post;
  while (
    pastFrameToCheck &&
    pastFrameToCheck.actionStateId === playerFrame.actionStateId
  ) {
    pastConfirmedFrame = pastFrameToCheck;
    frameIndex--;
    pastFrameToCheck =
      frames[frameIndex]?.players?.[playerFrame.playerIndex]?.post;
  }
  return pastConfirmedFrame;
};

export const getFrameIndexFromDuration = (
  playerFrame: DeepRequired<PostFrameUpdateType>,
  frames: DeepRequired<FramesType>,
  player: DeepRequired<PlayerType>,
): number => {
  const firstIndex = isOneIndexed(player.characterId, playerFrame.actionStateId)
    ? 1
    : 0;
  const firstFrame = getFirstFrameOfAnimation(playerFrame, frames);
  const framesInAnimation = playerFrame.frame - firstFrame.frame;
  return (
    framesInAnimation * (firstFrame.lCancelStatus === 1 ? 2 : 1) - firstIndex
  );
};

export const getFacingDirection = (
  frameFacing: number,
  animationName: string,
  character: CharacterName,
  animationFrameIndex: number,
): number => {
  const isMarthBairTurnaround =
    animationName === 'ATTACKAIRB' &&
    character === 'Marth' &&
    animationFrameIndex > 30;
  const isSmashTurn = animationName === 'SMASHTURN';
  const isSpacieBthrowTurnaround =
    animationName === 'THROWBACK' &&
    (character === 'Falco' || character === 'Fox') &&
    animationFrameIndex > 8;
  return isMarthBairTurnaround || isSmashTurn || isSpacieBthrowTurnaround
    ? -frameFacing
    : frameFacing;
};

export const getThrowerName = (
  player: DeepRequired<PlayerType>,
  animationName: string,
  frames: DeepRequired<FrameEntryType>,
): string => {
  const throwerAnimationName = `THROW${animationName.substr(6)}`;
  for (let i = 0; i < 4; i++) {
    if (i === player.playerIndex) {
      continue;
    }
    const otherPlayerFrame = frames.players[i];
    if (!otherPlayerFrame) {
      continue;
    }
    // this could be wrong if there's multiple of the same throw happening. I
    // don't know if replay data can connect thrower to throwee for doubles.
    if (
      animationNameByActionId[otherPlayerFrame.post.actionStateId] ===
      throwerAnimationName
    ) {
      const throwerName =
        characterNamesByInternalId[otherPlayerFrame.post.internalCharacterId];
      switch (throwerName) {
        case 'Fox':
          return 'FOX';
        case 'Captain Falcon':
          return 'FALCON';
        case 'Falco':
          return 'FALCO';
        case 'Jigglypuff':
          return 'PUFF';
        case 'Marth':
          return 'MARTH';
        case 'Sheik':
          return 'SHEIK';
      }
    }
  }
  console.log('Failed to find thrower', player.playerIndex, animationName);
  return 'FOX';
};

export const getShade = (
  playerIndex: number,
  players: DeepRequired<PlayerType[]>,
): number => {
  return players.filter(
    (player) =>
      player.playerIndex < playerIndex &&
      player.characterId === players[playerIndex].characterId &&
      player.teamId === players[playerIndex].teamId,
  ).length;
};
