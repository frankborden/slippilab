import type { Frame, PlayerSettings, PlayerState } from '@slippilab/parser';
import { isOneIndexed, animationNameByActionId } from './animations';
import { characterNamesByInternalId } from './common';
import type { CharacterName } from './common';

export const isInFrame = (frame: Frame, player: PlayerSettings): boolean => {
  return Boolean(frame.players[player.playerIndex]);
};

export const getFirstFrameOfAnimation = (
  playerFrame: PlayerState,
  frames: Frame[],
): PlayerState => {
  let frameIndex = playerFrame.frameNumber - 1;
  let pastConfirmedFrame = playerFrame;
  let pastFrameToCheck = playerFrame.isNana
    ? frames[frameIndex]?.players?.[playerFrame.playerIndex]?.nanaState
    : frames[frameIndex]?.players?.[playerFrame.playerIndex]?.state;
  while (
    pastFrameToCheck &&
    pastFrameToCheck.actionStateId === playerFrame.actionStateId
  ) {
    pastConfirmedFrame = pastFrameToCheck;
    frameIndex--;
    pastFrameToCheck = playerFrame.isNana
      ? frames[frameIndex]?.players?.[playerFrame.playerIndex]?.nanaState
      : frames[frameIndex]?.players?.[playerFrame.playerIndex]?.state;
  }
  return pastConfirmedFrame;
};

export const getFrameIndexFromDuration = (
  playerFrame: PlayerState,
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
    framesInAnimation * (firstFrame.lCancelStatus === 'successful' ? 2 : 1) -
    firstIndex
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
    const otherPlayerStates = [otherPlayerFrame.state];
    if (otherPlayerFrame.nanaState) {
      otherPlayerStates.push(otherPlayerFrame.nanaState);
    }
    for (const otherPlayerState of otherPlayerStates) {
      // this could be wrong if there's multiple of the same throw happening. I
      // don't know if replay data can connect thrower to throwee for doubles.
      if (
        animationNameByActionId[otherPlayerState.actionStateId] ===
        throwerAnimationName
      ) {
        const throwerName =
          characterNamesByInternalId[otherPlayerState.internalCharacterId];
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
