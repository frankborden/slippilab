import {
  PlayerState,
  PlayerUpdate,
  PlayerUpdateWithNana,
  ReplayData,
} from "~/common/types";

export function getStartOfAction(
  playerState: PlayerState,
  replayData: ReplayData
): number {
  let earliestStateOfAction = (
    getPlayerOnFrame(
      playerState.playerIndex,
      playerState.frameNumber,
      replayData
    ) as PlayerUpdateWithNana
  )[playerState.isNana ? "nanaState" : "state"];
  while (true) {
    const testEarlierState = getPlayerOnFrame(
      playerState.playerIndex,
      earliestStateOfAction.frameNumber - 1,
      replayData
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
  replayData: ReplayData
): PlayerUpdate {
  return replayData.frames[frameNumber]?.players[playerIndex];
}
