import { PlayerUpdate, PlayerUpdateWithNana, ReplayData } from '../common/types'

export function getStartOfAction (
  playerIndex: number,
  currentFrame: number,
  isNana: boolean,
  replayData: ReplayData
): number {
  let earliestStateOfAction = (
    getPlayerOnFrame(
      playerIndex,
      currentFrame,
      replayData
    ) as PlayerUpdateWithNana
  )[isNana ? 'nanaState' : 'state']
  while (true) {
    const testEarlierState = getPlayerOnFrame(
      playerIndex,
      earliestStateOfAction.frameNumber - 1,
      replayData
    )?.[isNana ? 'nanaState' : 'state']
    if (
      testEarlierState === undefined ||
      testEarlierState.actionStateId !== earliestStateOfAction.actionStateId
    ) {
      return earliestStateOfAction.frameNumber
    }
    earliestStateOfAction = testEarlierState
  }
}

export function getPlayerOnFrame (
  playerIndex: number,
  frameNumber: number,
  replayData: ReplayData
): PlayerUpdate {
  return replayData.frames[frameNumber]?.players[playerIndex]
}
