import type {
  Frame,
  GameEnding,
  GameSettings,
  ItemUpdate,
  PlayerInputs,
  PlayerState,
  ReplayData,
} from "~/common/types";

// This is a basic parser for use in the browser. It is based off of the replay
// format spec up to 3.9.0.0. It is incomplete, I have left out things I don't
// need right now. slippi-js can work in the browser too if your build tool
// de-node-ifies it enough.

/**
 * internal use only. The size of each event is announced at the start of the
 * replay file. This is used to find the start of every event for parsing.
 */
interface CommandPayloadSizes {
  [commandByte: number]: number;
}
const firstVersion = "0.1.0.0";

export function parseGameSettings({ metadata, raw }: any): GameSettings {
  const rawData = new DataView(
    raw.buffer,
    raw.byteOffset
    // baseJson.raw.byteLength
  );
  const commandPayloadSizes = parseEventPayloadsEvent(rawData, 0x00);
  const gameSettings = parseGameStartEvent(
    rawData,
    0x01 + commandPayloadSizes[0x35],
    metadata
  );
  return gameSettings;
}

export function parseReplay({ metadata, raw }: any): ReplayData {
  const rawData = new DataView(
    raw.buffer,
    raw.byteOffset
    // baseJson.raw.byteLength
  );
  // The first two events are always Event Payloads and Game Start.
  const commandPayloadSizes = parseEventPayloadsEvent(rawData, 0x00);

  const frames: Frame[] = [];

  const gameSettings = parseGameStartEvent(
    rawData,
    0x01 + commandPayloadSizes[0x35],
    metadata
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
  return {
    settings: gameSettings,
    frames: frames,
    ending: gameEnding as GameEnding,
  };
}

function handlePreFrameUpdateEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string,
  frames: Frame[]
): void {
  const playerInputs = parsePreFrameUpdateEvent(rawData, offset, replayVersion);
  // Some older versions don't have the Frame Start Event so we have to
  // potentially initialize the frame in both places.
  initFrameIfNeeded(frames, playerInputs.frameNumber);
  initPlayerIfNeeded(
    frames,
    playerInputs.frameNumber,
    playerInputs.playerIndex
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
  frames: Frame[]
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
  frames: Frame[]
): void {
  const { frameNumber, randomSeed } = parseFrameStartEvent(
    rawData,
    offset,
    replayVersion
  );
  initFrameIfNeeded(frames, frameNumber);
  // @ts-ignore will only be readonly once parser is done
  frames[frameNumber].randomSeed = randomSeed;
}

function handleItemUpdateEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string,
  frames: Frame[]
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
  playerIndex: number
): void {
  if (frames[frameNumber].players[playerIndex] === undefined) {
    // @ts-expect-error: state and inputs will be populated later.
    frames[frameNumber].players[playerIndex] = {
      frameNumber: frameNumber,
      playerIndex: playerIndex,
    };
  }
}

function parseEventPayloadsEvent(
  rawData: DataView,
  offset: number
): CommandPayloadSizes {
  const commandByte = readUint(
    rawData,
    8,
    firstVersion,
    firstVersion,
    offset + 0x00
  );
  const commandPayloadSizes: { [commandByte: number]: number } = {};
  const eventPayloadsPayloadSize = readUint(
    rawData,
    8,
    firstVersion,
    firstVersion,
    offset + 0x01
  );
  commandPayloadSizes[commandByte] = eventPayloadsPayloadSize;
  const listOffset = offset + 0x02;
  for (
    let i = listOffset;
    i < eventPayloadsPayloadSize + listOffset - 0x01;
    i += 0x03
  ) {
    const commandByte = readUint(
      rawData,
      8,
      firstVersion,
      firstVersion,
      i + 0x00
    );
    const payloadSize = readUint(
      rawData,
      16,
      firstVersion,
      firstVersion,
      i + 0x01
    );
    commandPayloadSizes[commandByte] = payloadSize;
  }
  return commandPayloadSizes;
}

function parseGameStartEvent(
  rawData: DataView,
  offset: number,
  metadata?: any
): GameSettings {
  const replayFormatVersion = [
    readUint(rawData, 8, firstVersion, firstVersion, offset + 0x01),
    readUint(rawData, 8, firstVersion, firstVersion, offset + 0x02),
    readUint(rawData, 8, firstVersion, firstVersion, offset + 0x03),
    readUint(rawData, 8, firstVersion, firstVersion, offset + 0x04),
  ].join(".");
  const settingsBitfield1 = readUint(
    rawData,
    8,
    replayFormatVersion,
    firstVersion,
    offset + 0x05
  );
  const settingsBitfield2 = readUint(
    rawData,
    8,
    replayFormatVersion,
    firstVersion,
    offset + 0x06
  );
  const settingsBitfield3 = readUint(
    rawData,
    8,
    replayFormatVersion,
    firstVersion,
    offset + 0x08
  );
  const settingsBitfield4 = readUint(
    rawData,
    8,
    replayFormatVersion,
    firstVersion,
    offset + 0x09
  );
  const timerTypeCode = settingsBitfield1 & 0b11;
  const gameModeCode = (settingsBitfield1 & 0b11100000) >> 5;
  const itemSpawnRateCode = readInt(
    rawData,
    8,
    replayFormatVersion,
    firstVersion,
    offset + 0x10
  );
  const settings: GameSettings = {
    isTeams: Boolean(
      readUint(rawData, 8, replayFormatVersion, firstVersion, offset + 0x0d)
    ),
    playerSettings: [],
    replayFormatVersion: replayFormatVersion,
    stageId: readUint(
      rawData,
      16,
      replayFormatVersion,
      firstVersion,
      offset + 0x13
    ),
    startTimestamp: metadata?.startAt,
    platform: metadata?.playedOn,
    isPal: Boolean(
      readUint(rawData, 8, replayFormatVersion, "1.5.0.0", offset + 0x1a1)
    ),
    isFrozenStadium: Boolean(
      readUint(rawData, 8, replayFormatVersion, "2.0.0.0", offset + 0x1a2)
    ),
    timerType:
      timerTypeCode === 0
        ? "no timer"
        : timerTypeCode === 2
        ? "counting down"
        : "counting up",
    characterUiPlacesCount: (settingsBitfield1 & 0b11100) >> 2,
    gameType:
      gameModeCode === 0
        ? "time"
        : gameModeCode === 1
        ? "stock"
        : gameModeCode === 2
        ? "coin"
        : "bonus",
    friendlyFireOn: Boolean(settingsBitfield2 & 0x01),
    isBreakTheTargetsOrTitleDemo: Boolean(settingsBitfield2 & 0x02),
    isClassicOrAdventureMode: Boolean(settingsBitfield2 & 0x04),
    isHomeRunContestOrEventMatch: Boolean(settingsBitfield2 & 0x08),
    isSingleButtonMode: Boolean(settingsBitfield3 & 0x10),
    timerCountsDuringPause: Boolean(settingsBitfield4 & 0x01),
    bombRain: Boolean(
      readUint(rawData, 8, replayFormatVersion, firstVersion, offset + 0xb)
    ),
    itemSpawnRate:
      itemSpawnRateCode === -1
        ? "off"
        : itemSpawnRateCode === 0
        ? "very low"
        : itemSpawnRateCode === 1
        ? "low"
        : itemSpawnRateCode === 2
        ? "medium"
        : itemSpawnRateCode === 3
        ? "high"
        : "very high",
    selfDestructScoreValue: readInt(
      rawData,
      8,
      replayFormatVersion,
      firstVersion,
      offset + 0x11
    ),
    timerStart: readUint(
      rawData,
      32,
      replayFormatVersion,
      firstVersion,
      offset + 0x15
    ),
    damageRatio: readFloat(
      rawData,
      32,
      replayFormatVersion,
      firstVersion,
      offset + 0x35
    ),
  };
  // @ts-ignore will only be readonly once parser is done
  settings.consoleNickname = metadata?.consoleNick;
  for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
    const playerType = readUint(
      rawData,
      8,
      settings.replayFormatVersion,
      firstVersion,
      offset + 0x66 + 0x24 * playerIndex
    );
    if (playerType === 3) continue;

    const dashbackFix = readUint(
      rawData,
      32,
      settings.replayFormatVersion,
      "1.0.0.0",
      offset + 0x141 + 0x8 * playerIndex
    );
    const shieldDropFix = readUint(
      rawData,
      32,
      settings.replayFormatVersion,
      "1.0.0.0",
      offset + 0x145 + 0x8 * playerIndex
    );
    const playerBitfield = readUint(
      rawData,
      8,
      settings.replayFormatVersion,
      firstVersion,
      offset + 0x71 + 0x24 * playerIndex
    );

    settings.playerSettings[playerIndex] = {
      playerIndex: playerIndex,
      port: playerIndex + 1,
      internalCharacterIds: Object.keys(
        metadata?.players[playerIndex]?.characters ?? {}
      ).map((key) => Number(key)),
      externalCharacterId: readUint(
        rawData,
        8,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x65 + 0x24 * playerIndex
      ),
      playerType: playerType,
      startStocks: readUint(
        rawData,
        8,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x67 + 0x24 * playerIndex
      ),
      costumeIndex: readUint(
        rawData,
        8,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x68 + 0x24 * playerIndex
      ),
      teamShade: readUint(
        rawData,
        8,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x6c + 0x24 * playerIndex
      ),
      handicap: readUint(
        rawData,
        8,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x6d + 0x24 * playerIndex
      ),
      teamId: readUint(
        rawData,
        8,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x6e + 0x24 * playerIndex
      ),
      staminaMode: Boolean(playerBitfield & 0x01),
      silentCharacter: Boolean(playerBitfield & 0x02),
      lowGravity: Boolean(playerBitfield & 0x04),
      invisible: Boolean(playerBitfield & 0x08),
      blackStockIcon: Boolean(playerBitfield & 0x10),
      metal: Boolean(playerBitfield & 0x20),
      startGameOnWarpPlatform: Boolean(playerBitfield & 0x40),
      rumbleEnabled: Boolean(playerBitfield & 0x80),
      cpuLevel: readUint(
        rawData,
        8,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x74 + 0x24 * playerIndex
      ),
      offenseRatio: readFloat(
        rawData,
        32,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x7d + 0x24 * playerIndex
      ),
      defenseRatio: readFloat(
        rawData,
        32,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x81 + 0x24 * playerIndex
      ),
      modelScale: readFloat(
        rawData,
        32,
        settings.replayFormatVersion,
        firstVersion,
        offset + 0x85 + 0x24 * playerIndex
      ),
      controllerFix:
        dashbackFix === shieldDropFix
          ? dashbackFix === 1
            ? "UCF"
            : dashbackFix === 2
            ? "Dween"
            : "None"
          : "Mixed",
      nametag: readShiftJisString(
        rawData,
        settings.replayFormatVersion,
        "1.3.0.0",
        offset + 0x161 + 0x10 * playerIndex,
        9
      ),
      displayName: readShiftJisString(
        rawData,
        settings.replayFormatVersion,
        "3.9.0.0",
        offset + 0x1a5 + 0x1f * playerIndex,
        16
      ),
      connectCode: readShiftJisString(
        rawData,
        settings.replayFormatVersion,
        "3.9.0.0",
        offset + 0x221 + 0x0a * playerIndex,
        10
      ),
    };
  }
  return settings;
}

function parseFrameStartEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string
): { frameNumber: number; randomSeed: number } {
  return {
    frameNumber:
      readInt(rawData, 32, replayVersion, "2.2.0.0", offset + 0x01) + 123,
    randomSeed: readUint(rawData, 32, replayVersion, "2.2.0.0", offset + 0x05),
  };
}

function parsePreFrameUpdateEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string
): PlayerInputs {
  const processedButtonsBitfield = readUint(
    rawData,
    32,
    replayVersion,
    "0.1.0.0",
    offset + 0x2d
  );
  const physicalButtonsBitfield = readUint(
    rawData,
    16,
    replayVersion,
    "0.1.0.0",
    offset + 0x31
  );
  return {
    frameNumber:
      readInt(rawData, 32, replayVersion, "0.1.0.0", offset + 0x01) + 123,
    playerIndex: readUint(rawData, 8, replayVersion, "0.1.0.0", offset + 0x05),
    isNana: Boolean(
      readUint(rawData, 8, replayVersion, "0.1.0.0", offset + 0x06)
    ),
    physical: {
      dPadLeft: Boolean(physicalButtonsBitfield & 0x0001),
      dPadRight: Boolean(physicalButtonsBitfield & 0x0002),
      dPadDown: Boolean(physicalButtonsBitfield & 0x0004),
      dPadUp: Boolean(physicalButtonsBitfield & 0x0008),
      z: Boolean(physicalButtonsBitfield & 0x0010),
      rTriggerAnalog: readFloat(
        rawData,
        32,
        replayVersion,
        "0.1.0.0",
        offset + 0x37
      ),
      rTriggerDigital: Boolean(physicalButtonsBitfield & 0x0020),
      lTriggerAnalog: readFloat(
        rawData,
        32,
        replayVersion,
        "0.1.0.0",
        offset + 0x33
      ),
      lTriggerDigital: Boolean(physicalButtonsBitfield & 0x0040),
      a: Boolean(physicalButtonsBitfield & 0x0100),
      b: Boolean(physicalButtonsBitfield & 0x0200),
      x: Boolean(physicalButtonsBitfield & 0x0400),
      y: Boolean(physicalButtonsBitfield & 0x0800),
      start: Boolean(physicalButtonsBitfield & 0x1000),
    },
    processed: {
      dPadLeft: Boolean(processedButtonsBitfield & 0x0001),
      dPadRight: Boolean(processedButtonsBitfield & 0x0002),
      dPadDown: Boolean(processedButtonsBitfield & 0x0004),
      dPadUp: Boolean(processedButtonsBitfield & 0x0008),
      z: Boolean(processedButtonsBitfield & 0x0010),
      rTriggerDigital: Boolean(processedButtonsBitfield & 0x0020),
      lTriggerDigital: Boolean(processedButtonsBitfield & 0x0040),
      a: Boolean(processedButtonsBitfield & 0x0100),
      b: Boolean(processedButtonsBitfield & 0x0200),
      x: Boolean(processedButtonsBitfield & 0x0400),
      y: Boolean(processedButtonsBitfield & 0x0800),
      start: Boolean(processedButtonsBitfield & 0x1000),
      joystickX: readFloat(
        rawData,
        32,
        replayVersion,
        "0.1.0.0",
        offset + 0x19
      ),
      joystickY: readFloat(
        rawData,
        32,
        replayVersion,
        "0.1.0.0",
        offset + 0x1d
      ),
      cStickX: readFloat(rawData, 32, replayVersion, "0.1.0.0", offset + 0x21),
      cStickY: readFloat(rawData, 32, replayVersion, "0.1.0.0", offset + 0x25),
      anyTrigger: readFloat(
        rawData,
        32,
        replayVersion,
        "0.1.0.0",
        offset + 0x29
      ),
    },
  };
}

function parsePostFrameUpdateEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string
): PlayerState {
  const hurtboxCollisionStateCode = readUint(
    rawData,
    8,
    replayVersion,
    "2.1.0.0",
    offset + 0x34
  );
  const lCancelStatusCode = readUint(
    rawData,
    8,
    replayVersion,
    "2.0.0.0",
    offset + 0x33
  );
  const stateBitfield1 = readUint(
    rawData,
    8,
    replayVersion,
    "2.1.0.0",
    offset + 0x26
  );
  const stateBitfield2 = readUint(
    rawData,
    8,
    replayVersion,
    "2.1.0.0",
    offset + 0x27
  );
  const stateBitfield3 = readUint(
    rawData,
    8,
    replayVersion,
    "2.1.0.0",
    offset + 0x28
  );
  const stateBitfield4 = readUint(
    rawData,
    8,
    replayVersion,
    "2.1.0.0",
    offset + 0x29
  );
  const stateBitfield5 = readUint(
    rawData,
    8,
    replayVersion,
    "2.1.0.0",
    offset + 0x2a
  );
  return {
    frameNumber:
      readInt(rawData, 32, replayVersion, "0.1.0.0", offset + 0x01) + 123,
    playerIndex: readUint(rawData, 8, replayVersion, "0.1.0.0", offset + 0x05),
    isNana: Boolean(
      readUint(rawData, 8, replayVersion, "0.1.0.0", offset + 0x06)
    ),
    internalCharacterId: readUint(
      rawData,
      8,
      replayVersion,
      "0.1.0.0",
      offset + 0x07
    ),
    actionStateId: readUint(
      rawData,
      16,
      replayVersion,
      "0.1.0.0",
      offset + 0x08
    ),
    xPosition: readFloat(rawData, 32, replayVersion, "0.1.0.0", offset + 0x0a),
    yPosition: readFloat(rawData, 32, replayVersion, "0.1.0.0", offset + 0x0e),
    facingDirection: readFloat(
      rawData,
      32,
      replayVersion,
      "0.1.0.0",
      offset + 0x12
    ),
    percent: readFloat(rawData, 32, replayVersion, "0.1.0.0", offset + 0x16),
    shieldSize: readFloat(rawData, 32, replayVersion, "0.1.0.0", offset + 0x1a),
    lastHittingAttackId: readUint(
      rawData,
      8,
      replayVersion,
      "0.1.0.0",
      offset + 0x1e
    ),
    currentComboCount: readUint(
      rawData,
      8,
      replayVersion,
      "0.1.0.0",
      offset + 0x1f
    ),
    lastHitBy: readUint(rawData, 8, replayVersion, "0.1.0.0", offset + 0x20),
    stocksRemaining: readUint(
      rawData,
      8,
      replayVersion,
      "0.1.0.0",
      offset + 0x21
    ),
    actionStateFrameCounter: readFloat(
      rawData,
      32,
      replayVersion,
      "0.2.0.0",
      offset + 0x22
    ),
    hitstunRemaining: readFloat(
      rawData,
      32,
      replayVersion,
      "2.0.0.0",
      offset + 0x2b
    ),
    isGrounded:
      readUint(rawData, 8, replayVersion, "2.0.0.0", offset + 0x2f) !== 0,
    lastGroundId: readUint(rawData, 8, replayVersion, "2.0.0.0", offset + 0x30),
    jumpsRemaining: readUint(
      rawData,
      8,
      replayVersion,
      "2.0.0.0",
      offset + 0x32
    ),
    lCancelStatus:
      lCancelStatusCode === 1
        ? "successful"
        : lCancelStatusCode === 2
        ? "missed"
        : undefined,
    hurtboxCollisionState:
      hurtboxCollisionStateCode === 0 || hurtboxCollisionStateCode === undefined
        ? "vulnerable"
        : hurtboxCollisionStateCode === 1
        ? "invulnerable"
        : "intangible",
    selfInducedAirXSpeed: readFloat(
      rawData,
      32,
      replayVersion,
      "3.5.0.0",
      offset + 0x35
    ),
    selfInducedAirYSpeed: readFloat(
      rawData,
      32,
      replayVersion,
      "3.5.0.0",
      offset + 0x39
    ),
    attackBasedXSpeed: readFloat(
      rawData,
      32,
      replayVersion,
      "3.5.0.0",
      offset + 0x3d
    ),
    attackBasedYSpeed: readFloat(
      rawData,
      32,
      replayVersion,
      "3.5.0.0",
      offset + 0x41
    ),
    selfInducedGroundXSpeed: readFloat(
      rawData,
      32,
      replayVersion,
      "3.5.0.0",
      offset + 0x45
    ),
    hitlagRemaining: readFloat(
      rawData,
      32,
      replayVersion,
      "3.8.0.0",
      offset + 0x49
    ),
    isReflectActive: Boolean(stateBitfield1 & 0x10),
    isFastfalling: Boolean(stateBitfield2 & 0x08),
    isShieldActive: Boolean(stateBitfield3 & 0x80),
    isInHitstun: Boolean(stateBitfield4 & 0x02),
    isHittingShield: Boolean(stateBitfield4 & 0x04),
    isPowershieldActive: Boolean(stateBitfield4 & 0x20),
    isDead: Boolean(stateBitfield5 & 0x40),
    isOffscreen: Boolean(stateBitfield5 & 0x80),
  };
}

function parseItemUpdateEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string
): ItemUpdate {
  return {
    frameNumber:
      readInt(rawData, 32, replayVersion, "3.0.0.0", offset + 0x01) + 123,
    typeId: readUint(rawData, 16, replayVersion, "3.0.0.0", offset + 0x05),
    state: readUint(rawData, 8, replayVersion, "3.0.0.0", offset + 0x07),
    facingDirection: readFloat(
      rawData,
      32,
      replayVersion,
      "3.0.0.0",
      offset + 0x08
    ),
    xVelocity: readFloat(rawData, 32, replayVersion, "3.0.0.0", offset + 0x0c),
    yVelocity: readFloat(rawData, 32, replayVersion, "3.0.0.0", offset + 0x10),
    xPosition: readFloat(rawData, 32, replayVersion, "3.0.0.0", offset + 0x14),
    yPosition: readFloat(rawData, 32, replayVersion, "3.0.0.0", offset + 0x18),
    damageTaken: readUint(rawData, 16, replayVersion, "3.0.0.0", offset + 0x1c),
    expirationTimer: readFloat(
      rawData,
      32,
      replayVersion,
      "3.0.0.0",
      offset + 0x1e
    ),
    spawnId: readUint(rawData, 32, replayVersion, "3.0.0.0", offset + 0x22),
    samusMissileType: readUint(
      rawData,
      8,
      replayVersion,
      "3.2.0.0",
      offset + 0x26
    ),
    peachTurnipFace: readUint(
      rawData,
      8,
      replayVersion,
      "3.2.0.0",
      offset + 0x27
    ),
    isChargeShotLaunched: Boolean(
      readUint(rawData, 8, replayVersion, "3.2.0.0", offset + 0x28)
    ),
    chargeShotChargeLevel: readUint(
      rawData,
      8,
      replayVersion,
      "3.2.0.0",
      offset + 0x29
    ),
    owner: readInt(rawData, 8, replayVersion, "3.6.0.0", offset + 0x2a),
  };
}

function parseGameEndEvent(
  rawData: DataView,
  offset: number,
  replayVersion: string
): GameEnding {
  const gameEndCode = readUint(
    rawData,
    8,
    replayVersion,
    "0.1.0.0",
    offset + 0x01
  );
  const quitInitiator = readInt(
    rawData,
    8,
    replayVersion,
    "2.0.0.0",
    offset + 0x02
  );

  if (gameEndCode === 0 || gameEndCode === 3) {
    return {
      oldGameEndMethod: gameEndCode === 3 ? "resolved" : "unresolved",
      quitInitiator,
    };
  } else {
    return {
      gameEndMethod:
        gameEndCode === 1
          ? "TIME!"
          : gameEndCode === 2
          ? "GAME!"
          : "No Contest",
      quitInitiator,
    };
  }
}

function readUint(
  rawData: DataView,
  size: 8 | 16 | 32,
  replayVersion: string,
  firstVersionPresent: string,
  offset: number
): number {
  if (!isInVersion(replayVersion, firstVersionPresent)) {
    // @ts-expect-error: I'd rather have missing data than make users deal with
    // all data being optional.
    return undefined;
  }
  switch (size) {
    case 8:
      return rawData.getUint8(offset);
    case 16:
      return rawData.getUint16(offset);
    case 32:
      return rawData.getUint32(offset);
  }
}

function readFloat(
  rawData: DataView,
  size: 32 | 64,
  replayVersion: string,
  firstVersionPresent: string,
  offset: number
): number {
  if (!isInVersion(replayVersion, firstVersionPresent)) {
    // @ts-expect-error: I'd rather have missing data than make users deal with
    // all data being optional.
    return undefined;
  }
  switch (size) {
    case 32:
      return rawData.getFloat32(offset);
    case 64:
      return rawData.getFloat64(offset);
  }
}

function readInt(
  rawData: DataView,
  size: 8 | 16 | 32,
  replayVersion: string,
  firstVersionPresent: string,
  offset: number
): number {
  if (!isInVersion(replayVersion, firstVersionPresent)) {
    // @ts-expect-error: I'd rather have missing data than make users deal with
    // all data being optional.
    return undefined;
  }
  switch (size) {
    case 8:
      return rawData.getInt8(offset);
    case 16:
      return rawData.getInt16(offset);
    case 32:
      return rawData.getInt32(offset);
  }
}

function readShiftJisString(
  rawData: DataView,
  replayVersion: string,
  firstVersionPresent: string,
  offset: number,
  maxLength: number
): string {
  if (!isInVersion(replayVersion, firstVersionPresent)) {
    // @ts-expect-error: I'd rather have missing data than make users deal with
    // all data being optional.
    return undefined;
  }
  const shiftJisBytes = new Uint8Array(maxLength);
  let charNum = 0;
  do {
    shiftJisBytes[charNum] = rawData.getUint8(offset + charNum * 0x01);
    charNum++;
  } while (charNum < maxLength && shiftJisBytes[charNum - 1] !== 0x00);
  if (shiftJisBytes[0] !== 0x00) {
    const decoder = new TextDecoder("shift-jis");
    return toHalfWidth(decoder.decode(shiftJisBytes.subarray(0, charNum - 1)));
  }
  return "";
}

function isInVersion(
  replayVersion: string,
  firstVersionPresent: string
): boolean {
  const replayVersionParts = replayVersion.split(".");
  const firstVersionParts = firstVersionPresent.split(".");
  for (let i = 0; i < replayVersionParts.length; i++) {
    const replayVersionPart = parseInt(replayVersionParts[i]);
    const firstVersionPart = parseInt(firstVersionParts[i]);
    if (replayVersionPart > firstVersionPart) return true;
    if (replayVersionPart < firstVersionPart) return false;
  }
  return true;
}

function toHalfWidth(s: string): string {
  return s.replace(/[！-～]/g, function (r) {
    return String.fromCharCode(r.charCodeAt(0) - 0xfee0);
  });
}
