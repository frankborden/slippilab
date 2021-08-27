import type {
  Frame,
  PlayerSettings,
  PostFrameUpdateEvent,
} from '../parser/slp';
import { isOneIndexed, animationNameByActionId } from './animations';
import { characterNamesByInternalId } from './common';
import type { CharacterName } from './common';

export const isInFrame = (frame: Frame, player: PlayerSettings): boolean => {
  return Boolean(frame.players[player.playerIndex]);
};

export const getFirstFrameOfAnimation = (
  playerFrame: PostFrameUpdateEvent,
  frames: Frame[],
): PostFrameUpdateEvent => {
  let frameIndex = playerFrame.frameNumber - 1;
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
  playerFrame: PostFrameUpdateEvent,
  frames: Frame[],
  player: PlayerSettings,
): number => {
  const firstIndex = isOneIndexed(
    player.externalCharacterId,
    playerFrame.actionStateId,
  )
    ? 1
    : 0;
  const firstFrame = getFirstFrameOfAnimation(playerFrame, frames);
  const framesInAnimation = playerFrame.frameNumber - firstFrame.frameNumber;
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
  const isBackItemToss =
    [
      'LightThrowB',
      'LightThrowB4',
      'LightThrowAirB',
      'LightThrowAirB4',
    ].includes(animationName) && animationFrameIndex > 7;
  const isMarthBairTurnaround =
    animationName === 'AttackAirB' &&
    character === 'Marth' &&
    animationFrameIndex > 31;
  const isSpacieBthrowTurnaround =
    animationName === 'ThrowB' &&
    (character === 'Falco' || character === 'Fox') &&
    animationFrameIndex > 8;
  const isStandingTurnaround =
    animationName === 'Turn' && animationFrameIndex > 5;
  return isBackItemToss ||
    isMarthBairTurnaround ||
    isSpacieBthrowTurnaround ||
    isStandingTurnaround
    ? -frameFacing
    : frameFacing;
};

export const getThrowerName = (
  player: PlayerSettings,
  throwDirection: string,
  frame: Frame,
): string => {
  const throwerAnimationName = `Throw${throwDirection}`;
  for (let i = 0; i < 4; i++) {
    if (i === player.playerIndex) {
      continue;
    }
    const otherPlayerFrame = frame.players[i];
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
          return 'Fox';
        case 'Captain Falcon':
          return 'Captain';
        case 'Falco':
          return 'Falco';
        case 'Jigglypuff':
          return 'Mars';
        case 'Marth':
          return 'Mars';
        case 'Sheik':
          return 'Seak';
      }
    }
  }
  console.log('Failed to find thrower', player.playerIndex, throwDirection);
  return 'FOX';
};

export const getShade = (
  playerIndex: number,
  players: PlayerSettings[],
): number => {
  return players.filter(
    (player) =>
      player.playerIndex < playerIndex &&
      player.externalCharacterId === players[playerIndex].externalCharacterId &&
      player.teamId === players[playerIndex].teamId,
  ).length;
};
