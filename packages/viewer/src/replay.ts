import type { Frame, PlayerSettings, PlayerState } from '@slippilab/common';
import { isOneIndexed, animationNameByActionId } from './animations';
import { characterNamesByInternalId } from './common';
import type { CharacterName } from './common';

export function isInFrame(frame: Frame, player: PlayerSettings): boolean {
  return Boolean(frame.players[player.playerIndex]);
}

export function getFirstFrameOfAnimation(
  playerFrame: PlayerState,
  frames: Frame[],
): PlayerState {
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
}

export function getFrameIndexFromDuration(
  playerFrame: PlayerState,
  frames: Frame[],
  player: PlayerSettings,
): number {
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
}

export function getFacingDirection(
  playerFrame: PlayerState,
  frames: Frame[],
  animationName: string,
  character: CharacterName,
): number {
  // By default we want to use the facingDirection from the start of the
  // animation because some moves will update facingDirection partway through
  // and the animation should not compensate for it. For example Marth's back
  // air. However, some animations -optionally- turn you around and the
  // animation needs to compensate for it. In those cases we need to respect the
  // -current- facingDirection.
  const maybeMidairJumpTurnaround =
    ['Jigglypuff', 'Kirby', 'Yoshi'].includes(character) &&
    animationName.includes('Jump');
  const maybeUpBTurnaround =
    animationName === 'SpecialHi' || animationName === 'SpecialAirHi';
  if (maybeUpBTurnaround || maybeMidairJumpTurnaround) {
    return playerFrame.facingDirection;
  }
  return getFirstFrameOfAnimation(playerFrame, frames).facingDirection;
}

export function getThrowerName(
  player: PlayerSettings,
  throwDirection: string,
  frame: Frame,
): string {
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
}

export function getShade(
  playerIndex: number,
  players: PlayerSettings[],
): number {
  return players.filter(
    (player) =>
      player.playerIndex < playerIndex &&
      player.externalCharacterId === players[playerIndex].externalCharacterId &&
      player.teamId === players[playerIndex].teamId,
  ).length;
}
