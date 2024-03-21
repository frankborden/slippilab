import type {
  Frame,
  GameEnding,
  ReplayData,
  ReplayStub,
  ReplayType,
} from "../common/types";
import {
  parseEventPayloadsEvent,
  parseFrameStartEvent,
  parseGameEndEvent,
  parseGameStartEvent,
  parseItemUpdateEvent,
  parsePostFrameUpdateEvent,
  parsePreFrameUpdateEvent,
} from "./events";
import { firstVersion, readUint } from "./utils";

// This is a basic parser for use in the browser. It is based off of the replay
// format spec up to 3.14.0.0. It is incomplete, I have left out things I don't
// need right now. slippi-js can work in the browser too if your build tool
// de-node-ifies it enough.

/**
 * startTimestamp is not read because it's at the end of the file.
 */
export function parseStub(
  raw: ArrayBufferLike,
): Omit<ReplayStub, "startTimestamp" | "slug"> {
  const rawData = new DataView(raw, 15);
  const commandPayloadSizes = parseEventPayloadsEvent(rawData, 0x00);
  const gameSettings = parseGameStartEvent(
    rawData,
    0x01 + commandPayloadSizes[0x35],
  );
  let type: ReplayType;
  if (gameSettings.matchId === undefined) {
    if (
      gameSettings.playerSettings.filter(Boolean)[0].connectCode === undefined
    ) {
      type = "offline";
    } else {
      type = "old online";
    }
  } else {
    switch (gameSettings.matchId.match(/mode\.([^-]+)/)![1]) {
      case "unranked":
        type = "unranked";
        break;
      case "direct":
        type = "direct";
        break;
      case "ranked":
        type = "ranked";
        break;
      default:
        // impossible
        type = "old online";
        break;
    }
  }
  return {
    type,
    stageId: gameSettings.stageId,
    matchId: gameSettings.matchId,
    gameNumber: gameSettings.gameNumber,
    tiebreakerNumber: gameSettings.tiebreakerNumber,
    players: gameSettings.playerSettings.filter(Boolean).map((p) => ({
      playerIndex: p.playerIndex,
      teamId: p.teamId,
      externalCharacterId: p.externalCharacterId,
      costumeIndex: p.costumeIndex,
      connectCode: p.connectCode,
      displayName: p.displayName,
      nametag: p.nametag,
    })),
  };
}

export function parseReplay(metadata: any, raw: Uint8Array): ReplayData {
  const rawData = new DataView(raw.buffer, 15);
  // The first two events are always Event Payloads and Game Start.
  const commandPayloadSizes = parseEventPayloadsEvent(rawData, 0x00);

  const frames: Frame[] = [];

  const gameSettings = parseGameStartEvent(
    rawData,
    0x01 + commandPayloadSizes[0x35],
    metadata,
  );
  let gameEnding: GameEnding | undefined;
  const replayVersion = gameSettings.replayFormatVersion;
  let offset =
    0x00 + commandPayloadSizes[0x35] + 0x01 + commandPayloadSizes[0x36] + 0x01;
  // inputs/states may come multiple times for a given player on a given
  // frame due to rollbacks. Because we are overwriting, we will just save the
  // last one which will be the official "finalized" one.
  while (offset < rawData.byteLength) {
    const command = readUint(rawData, 8, replayVersion, firstVersion, offset);
    switch (command) {
      case 0x37:
        handlePreFrameUpdateEvent(rawData, offset, replayVersion, frames);
        break;
      case 0x38:
        handlePostFrameUpdateEvent(rawData, offset, replayVersion, frames);
        break;
      case 0x39:
        gameEnding = parseGameEndEvent(rawData, offset, replayVersion);
        break;
      case 0x3a:
        handleFrameStartEvent(rawData, offset, replayVersion, frames);
        break;
      case 0x3b:
        handleItemUpdateEvent(rawData, offset, replayVersion, frames);
        break;
    }
    offset = offset + commandPayloadSizes[command] + 0x01;
  }
  if (gameEnding === undefined) {
    console.warn("Game end event not found");
    // throw new Error("Game Ending not found");
  }
  let type: ReplayType;
  if (gameSettings.matchId === undefined) {
    if (
      gameSettings.playerSettings.filter(Boolean)[0].connectCode === undefined
    ) {
      type = "offline";
    } else {
      type = "old online";
    }
  } else {
    switch (gameSettings.matchId.match(/mode\.([^-]+)/)![1]) {
      case "unranked":
        type = "unranked";
        break;
      case "direct":
        type = "direct";
        break;
      case "ranked":
        type = "ranked";
        break;
      default:
        // impossible
        type = "old online";
        break;
    }
  }
  return {
    type,
    settings: gameSettings,
    frames: frames,
    ending: gameEnding as GameEnding,
  };
}

function handlePreFrameUpdateEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string,
  frames: Frame[],
): void {
  const playerInputs = parsePreFrameUpdateEvent(rawData, offset, replayVersion);
  // Some older versions don't have the Frame Start Event so we have to
  // potentially initialize the frame in both places.
  initFrameIfNeeded(frames, playerInputs.frameNumber);
  initPlayerIfNeeded(
    frames,
    playerInputs.frameNumber,
    playerInputs.playerIndex,
  );
  if (playerInputs.isNana) {
    frames[playerInputs.frameNumber].players[
      playerInputs.playerIndex
      // @ts-ignore will only be readonly once parser is done
    ].nanaInputs = playerInputs;
  } else {
    // @ts-ignore will only be readonly once parser is done
    frames[playerInputs.frameNumber].players[playerInputs.playerIndex].inputs =
      playerInputs;
  }
}

function handlePostFrameUpdateEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string,
  frames: Frame[],
): void {
  const playerState = parsePostFrameUpdateEvent(rawData, offset, replayVersion);
  if (playerState.isNana) {
    // @ts-ignore will only be readonly once parser is done
    frames[playerState.frameNumber].players[playerState.playerIndex].nanaState =
      playerState;
  } else {
    // @ts-ignore will only be readonly once parser is done
    frames[playerState.frameNumber].players[playerState.playerIndex].state =
      playerState;
  }
}

function handleFrameStartEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string,
  frames: Frame[],
): void {
  const { frameNumber, randomSeed } = parseFrameStartEvent(
    rawData,
    offset,
    replayVersion,
  );
  initFrameIfNeeded(frames, frameNumber);
  // @ts-ignore will only be readonly once parser is done
  frames[frameNumber].randomSeed = randomSeed;
}

function handleItemUpdateEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string,
  frames: Frame[],
): void {
  const itemUpdate = parseItemUpdateEvent(rawData, offset, replayVersion);
  frames[itemUpdate.frameNumber].items.push(itemUpdate);
}

function initFrameIfNeeded(frames: Frame[], frameNumber: number): void {
  if (frames[frameNumber] === undefined) {
    // @ts-expect-error: randomSeed will be populated later if found.
    frames[frameNumber] = {
      frameNumber: frameNumber,
      players: [],
      items: [],
    };
  }
}

function initPlayerIfNeeded(
  frames: Frame[],
  frameNumber: number,
  playerIndex: number,
): void {
  if (frames[frameNumber].players[playerIndex] === undefined) {
    // @ts-expect-error: state and inputs will be populated later.
    frames[frameNumber].players[playerIndex] = {
      frameNumber: frameNumber,
      playerIndex: playerIndex,
    };
  }
}
