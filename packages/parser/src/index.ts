import { decode } from '@shelacek/ubjson';

/**
 * This is a quick-n-dirty parser for use in the browser.
 * It is based off of the replay format spec up to 3.9.0.0.
 * It is incomplete, I have left out things I don't need right now.
 * slippi-js can work too if your build tool de-node-ifies it enough.
 */

interface EventPayloadsEvent {
  [commandByte: number]: number;
}

export interface GameStartEvent {
  isTeams: boolean;
  playerSettings: PlayerSettings[];
  replayFormatVersion: string;
  stageId: number;
}

export interface PlayerSettings {
  playerIndex: number;
  port: number;
  externalCharacterId: number;
  playerType: number;
  startStocks: number;
  costumeIndex: number;
  teamShade: number;
  handicap: number;
  teamId: number;
  playerBitfield: number;
  cpuLevel: number;
  offenseRatio: number;
  defenseRatio: number;
  modelScale: number;
  controllerFix: 'None' | 'UCF' | 'Dween' | 'Mixed';
  nametag: string;
  displayName: string;
  connectCode: string;
}

export interface PreFrameUpdateEvent {
  frameNumber: number;
  playerIndex: number;
  isFollower: boolean;
  actionStateId: number;
  xPosition: number;
  yPosition: number;
  facingDirection: number;
  joystickX: number;
  joystickY: number;
  cStickX: number;
  cStickY: number;
  trigger: number;
  processedButtons: number;
  physicalButtons: number;
  physicalLTrigger: number;
  physicalRTrigger: number;
  percent: number;
}
export interface PostFrameUpdateEvent {
  frameNumber: number;
  playerIndex: number;
  isFollower: boolean;
  internalCharacterId: number;
  actionStateId: number;
  xPosition: number;
  yPosition: number;
  facingDirection: number;
  percent: number;
  shieldSize: number;
  lastHittingAttackId: number;
  currentComboCount: number;
  lastHitBy: number;
  stocksRemaining: number;
  actionStateFrameCounter: number;
  isGrounded: boolean;
  lastGroundId: number;
  jumpsRemaining: number;
  lCancelStatus: number;
  hurtboxCollisionState: number;
  selfInducedAirXSpeed: number;
  selfInducedAirYSpeed: number;
  attackBasedXSpeed: number;
  attackBasedYSpeed: number;
  selfInducedGroundXSpeed: number;
  hitlagRemaining: number;
  // TODO: State Bit Flags 1-5
}
export interface GameEndEvent {
  gameEndMethod: number;
  quitInitiator: number;
}
export interface FrameStartEvent {
  frameNumber: number;
  randomSeed: number;
}
export interface ItemUpdateEvent {
  frameNumber: number;
  typeId: number;
  state: number;
  facingDirection: number;
  xVelocity: number;
  yVelocity: number;
  xPosition: number;
  yPosition: number;
  damageTaken: number;
  expirationTimer: number;
  spawnId: number;
  samusMissileType: number;
  peachTurnipFace: number;
  // TODO misc 3/4
  owner: number;
}
export interface FrameBookendEvent {
  frameNumber: number;
  latestFinalizedFrame: number;
}
export interface Frame {
  frameNumber: number;
  start: FrameStartEvent;
  end: FrameBookendEvent;
  players: { pre: PreFrameUpdateEvent[]; post: PostFrameUpdateEvent[] }[];
  items: ItemUpdateEvent[];
}

const allVersions = '0.0.0.0';

export class Game {
  public metadata: any;
  public gameStart: GameStartEvent;
  public gameEnd!: GameEndEvent;

  // Frames begins at index -123.
  // Players get control at -39.
  // Timer starts counting at 0.
  public frames: Frame[] = [];

  // Not used after parsing. This gets populated once we parse enough of the
  // replay to determine the version. It's used to decide what fields we should
  // expect to find in the file.
  private formatVersion: string;

  // Not used after parsing. Array buffer of the 'raw' element in the .slp spec.
  private raw: DataView;

  constructor(fileBuffer: ArrayBuffer) {
    const baseJson = decode(fileBuffer, { useTypedArrays: true });
    this.metadata = baseJson.metadata;
    this.raw = new DataView(
      baseJson.raw.buffer,
      baseJson.raw.byteOffset,
      baseJson.raw.byteLength,
    );

    // The first two events are always Event Payloads and Game Start.
    let commandPayloadSizes = this.parseEventPayloadsEvent(0x00);
    this.gameStart = this.parseGameStartEvent(0x01 + commandPayloadSizes[0x35]);
    this.formatVersion = this.gameStart.replayFormatVersion;
    let offset =
      0x00 +
      commandPayloadSizes[0x35] +
      0x01 +
      commandPayloadSizes[0x36] +
      0x01;
    while (offset < this.raw.byteLength) {
      const command = this.getUint(8, allVersions, offset);
      let event;
      switch (command) {
        case 0x37:
          event = this.parsePreFrameUpdateEvent(offset);
          // Some older versions don't have the Frame Start Event so we have to
          // potentially initialize the frame in both places.
          this.initFrameIfNeeded(event.frameNumber);
          this.initPlayerIfNeeded(event.frameNumber, event.playerIndex);
          this.frames[event.frameNumber].players[event.playerIndex].pre.push(
            event,
          );
          break;
        case 0x38:
          event = this.parsePostFrameUpdateEvent(offset);
          this.frames[event.frameNumber].players[event.playerIndex].post.push(
            event,
          );
          break;
        case 0x39:
          this.gameEnd = this.parseGameEndEvent(offset);
          break;
        case 0x3a:
          event = this.parseFrameStartEvent(offset);
          this.initFrameIfNeeded(event.frameNumber);
          this.frames[event.frameNumber].start = event;
          break;
        case 0x3b:
          event = this.parseItemUpdateEvent(offset);
          this.frames[event.frameNumber].items.push(event);
          break;
        case 0x3c:
          event = this.parseFrameBookendEvent(offset);
          this.frames[event.frameNumber].end = event;
          break;
        case 0x3d:
          // Gecko List Event
          // TODO
          break;
        case 0x10:
          // Message Splitter
          // TODO
          break;
      }
      offset = offset + commandPayloadSizes[command] + 0x01;
    }
  }

  private initFrameIfNeeded(frameNumber: number) {
    if (!this.frames[frameNumber]) {
      this.frames[frameNumber] = {
        frameNumber: frameNumber,
        //@ts-ignore
        start: undefined,
        //@ts-ignore
        end: undefined,
        players: [],
        items: [],
      };
    }
  }

  private initPlayerIfNeeded(frameNumber: number, playerIndex: number) {
    if (!this.frames[frameNumber].players[playerIndex]) {
      this.frames[frameNumber].players[playerIndex] = {
        pre: [],
        post: [],
      };
    }
  }

  private parseEventPayloadsEvent(offset: number): EventPayloadsEvent {
    const commandByte = this.getUint(8, allVersions, offset + 0x00);
    const commandPayloadSizes: { [commandByte: number]: number } = {};
    const eventPayloadsPayloadSize = this.getUint(
      8,
      allVersions,
      offset + 0x01,
    );
    commandPayloadSizes[commandByte] = eventPayloadsPayloadSize;
    const listOffset = offset + 0x02;
    for (
      let i = listOffset;
      i < eventPayloadsPayloadSize + listOffset - 0x01;
      i += 0x03
    ) {
      const commandByte = this.getUint(8, allVersions, i + 0x00);
      const payloadSize = this.getUint(16, allVersions, i + 0x01);
      commandPayloadSizes[commandByte] = payloadSize;
    }
    return commandPayloadSizes;
  }

  private parseGameStartEvent(offset: number): GameStartEvent {
    const event: GameStartEvent = {
      isTeams: Boolean(this.getUint(8, allVersions, offset + 0x0d)),
      playerSettings: [],
      replayFormatVersion: [
        this.getUint(8, allVersions, offset + 0x01),
        this.getUint(8, allVersions, offset + 0x02),
        this.getUint(8, allVersions, offset + 0x03),
        this.getUint(8, allVersions, offset + 0x04),
      ].join('.'),
      stageId: this.getUint(16, allVersions, offset + 0x13),
    };
    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      const playerType = this.getUint(
        8,
        allVersions,
        offset + 0x66 + 0x24 * playerIndex,
      );
      if (playerType === 3) continue;

      const dashbackFix = this.getUint(
        32,
        allVersions,
        offset + 0x141 + 0x8 * playerIndex,
      );
      const shieldDropFix = this.getUint(
        32,
        allVersions,
        offset + 0x145 + 0x8 * playerIndex,
      );

      event.playerSettings[playerIndex] = {
        playerIndex: playerIndex,
        port: playerIndex + 1,
        externalCharacterId: this.getUint(
          8,
          allVersions,
          offset + 0x65 + 0x24 * playerIndex,
        ),
        playerType: playerType,
        startStocks: this.getUint(
          8,
          allVersions,
          offset + 0x67 + 0x24 * playerIndex,
        ),
        costumeIndex: this.getUint(
          8,
          allVersions,
          offset + 0x68 + 0x24 * playerIndex,
        ),
        teamShade: this.getUint(
          8,
          allVersions,
          offset + 0x6c + 0x24 * playerIndex,
        ),
        handicap: this.getUint(
          8,
          allVersions,
          offset + 0x6d + 0x24 * playerIndex,
        ),
        teamId: this.getUint(
          8,
          allVersions,
          offset + 0x6e + 0x24 * playerIndex,
        ),
        playerBitfield: this.getUint(
          8,
          allVersions,
          offset + 0x71 + 0x24 * playerIndex,
        ),
        cpuLevel: this.getUint(
          8,
          allVersions,
          offset + 0x74 + 0x24 * playerIndex,
        ),
        offenseRatio: this.getFloat(
          32,
          allVersions,
          offset + 0x7d + 0x24 * playerIndex,
        ),
        defenseRatio: this.getFloat(
          32,
          allVersions,
          offset + 0x81 + 0x24 * playerIndex,
        ),
        modelScale: this.getFloat(
          32,
          allVersions,
          offset + 0x85 + 0x24 * playerIndex,
        ),
        controllerFix:
          dashbackFix === shieldDropFix
            ? dashbackFix === 1
              ? 'UCF'
              : dashbackFix === 2
              ? 'Dween'
              : 'None'
            : 'Mixed',
        // TODO verify
        nametag: this.readShiftJisString(
          '1.3.0.0',
          offset + 0x161 + 0x10 * playerIndex,
          9,
        ),
        displayName: this.readShiftJisString(
          '3.9.0.0',
          offset + 0x1a5 + 0x1f * playerIndex,
          16,
        ),
        connectCode: this.readShiftJisString(
          '3.9.0.0',
          offset + 0x221 + 0x0a * playerIndex,
          10,
        ),
      };
    }
    return event;
  }

  private parseFrameStartEvent(offset: number): FrameStartEvent {
    return {
      frameNumber: this.getInt(32, '2.2.0.0', offset + 0x01),
      randomSeed: this.getUint(32, '2.2.0.0', offset + 0x05),
    };
  }

  private parsePreFrameUpdateEvent(offset: number): PreFrameUpdateEvent {
    return {
      frameNumber: this.getInt(32, '0.1.0.0', offset + 0x01),
      playerIndex: this.getUint(8, '0.1.0.0', offset + 0x05),
      isFollower: Boolean(this.getUint(8, '0.1.0.0', offset + 0x06)),
      actionStateId: this.getUint(16, '0.1.0.0', offset + 0x0b),
      xPosition: this.getFloat(32, '0.1.0.0', offset + 0x0d),
      yPosition: this.getFloat(32, '0.1.0.0', offset + 0x11),
      facingDirection: this.getFloat(32, '0.1.0.0', offset + 0x15),
      joystickX: this.getFloat(32, '0.1.0.0', offset + 0x19),
      joystickY: this.getFloat(32, '0.1.0.0', offset + 0x1d),
      cStickX: this.getFloat(32, '0.1.0.0', offset + 0x21),
      cStickY: this.getFloat(32, '0.1.0.0', offset + 0x25),
      trigger: this.getFloat(32, '0.1.0.0', offset + 0x29),
      processedButtons: this.getUint(32, '0.1.0.0', offset + 0x2d),
      physicalButtons: this.getUint(16, '0.1.0.0', offset + 0x31),
      physicalLTrigger: this.getFloat(32, '0.1.0.0', offset + 0x33),
      physicalRTrigger: this.getFloat(32, '0.1.0.0', offset + 0x37),
      percent: this.getFloat(32, '1.4.0.0', offset + 0x3c),
    };
  }

  private parsePostFrameUpdateEvent(offset: number): PostFrameUpdateEvent {
    return {
      frameNumber: this.getInt(32, '0.1.0.0', offset + 0x01),
      playerIndex: this.getUint(8, '0.1.0.0', offset + 0x05),
      isFollower: Boolean(this.getUint(8, '0.1.0.0', offset + 0x06)),
      internalCharacterId: this.getUint(8, '0.1.0.0', offset + 0x07),
      actionStateId: this.getUint(16, '0.1.0.0', offset + 0x08),
      xPosition: this.getFloat(32, '0.1.0.0', offset + 0x0a),
      yPosition: this.getFloat(32, '0.1.0.0', offset + 0x0e),
      facingDirection: this.getFloat(32, '0.1.0.0', offset + 0x12),
      percent: this.getFloat(32, '0.1.0.0', offset + 0x16),
      shieldSize: this.getFloat(32, '0.1.0.0', offset + 0x1a),
      lastHittingAttackId: this.getUint(8, '0.1.0.0', offset + 0x1e),
      currentComboCount: this.getUint(8, '0.1.0.0', offset + 0x1f),
      lastHitBy: this.getUint(8, '0.1.0.0', offset + 0x20),
      stocksRemaining: this.getUint(8, '0.1.0.0', offset + 0x21),
      actionStateFrameCounter: this.getFloat(32, '0.2.0.0', offset + 0x22),
      isGrounded: !Boolean(this.getUint(8, '2.0.0.0', offset + 0x2f)),
      lastGroundId: this.getUint(8, '2.0.0.0', offset + 0x30),
      jumpsRemaining: this.getUint(8, '2.0.0.0', offset + 0x32),
      lCancelStatus: this.getUint(8, '2.0.0.0', offset + 0x33),
      hurtboxCollisionState: this.getUint(8, '2.1.0.0', offset + 0x34),
      selfInducedAirXSpeed: this.getFloat(32, '3.5.0.0', offset + 0x35),
      selfInducedAirYSpeed: this.getFloat(32, '3.5.0.0', offset + 0x39),
      attackBasedXSpeed: this.getFloat(32, '3.5.0.0', offset + 0x3d),
      attackBasedYSpeed: this.getFloat(32, '3.5.0.0', offset + 0x41),
      selfInducedGroundXSpeed: this.getFloat(32, '3.5.0.0', offset + 0x45),
      hitlagRemaining: this.getFloat(32, '3.8.0.0', offset + 0x49),
    };
  }

  private parseItemUpdateEvent(offset: number): ItemUpdateEvent {
    return {
      frameNumber: this.getInt(32, '3.0.0.0', offset + 0x01),
      typeId: this.getUint(16, '3.0.0.0', offset + 0x05),
      state: this.getUint(8, '3.0.0.0', offset + 0x07),
      facingDirection: this.getFloat(32, '3.0.0.0', offset + 0x08),
      xVelocity: this.getFloat(32, '3.0.0.0', offset + 0x0c),
      yVelocity: this.getFloat(32, '3.0.0.0', offset + 0x10),
      xPosition: this.getFloat(32, '3.0.0.0', offset + 0x14),
      yPosition: this.getFloat(32, '3.0.0.0', offset + 0x18),
      damageTaken: this.getUint(16, '3.0.0.0', offset + 0x1c),
      expirationTimer: this.getFloat(32, '3.0.0.0', offset + 0x1e),
      spawnId: this.getUint(32, '3.0.0.0', offset + 0x22),
      samusMissileType: this.getUint(8, '3.2.0.0', offset + 0x26),
      peachTurnipFace: this.getUint(8, '3.2.0.0', offset + 0x27),
      owner: this.getInt(8, '3.6.0.0', offset + 0x2a),
    };
  }

  private parseFrameBookendEvent(offset: number): FrameBookendEvent {
    return {
      frameNumber: this.getInt(32, '3.0.0.0', offset + 0x01),
      latestFinalizedFrame: this.getInt(32, '3.7.0.0', offset + 0x05),
    };
  }

  private parseGameEndEvent(offset: number): GameEndEvent {
    return {
      gameEndMethod: this.getUint(8, '0.1.0.0', offset + 0x01),
      quitInitiator: this.getInt(8, '2.0.0.0', offset + 0x02),
    };
  }

  private getUint(
    size: 8 | 16 | 32,
    firstVersion: string,
    offset: number,
  ): number {
    if ([this.formatVersion, firstVersion].sort()[0] !== firstVersion) {
      // @ts-ignore
      return undefined;
    }
    switch (size) {
      case 8:
        return this.raw.getUint8(offset);
      case 16:
        return this.raw.getUint16(offset);
      case 32:
        return this.raw.getUint32(offset);
    }
  }

  private getFloat(
    size: 32 | 64,
    firstVersion: string,
    offset: number,
  ): number {
    if ([this.formatVersion, firstVersion].sort()[0] !== firstVersion) {
      // @ts-ignore
      return undefined;
    }
    switch (size) {
      case 32:
        return this.raw.getFloat32(offset);
      case 64:
        return this.raw.getFloat64(offset);
    }
  }

  private getInt(
    size: 8 | 16 | 32,
    firstVersion: string,
    offset: number,
  ): number {
    if ([this.formatVersion, firstVersion].sort()[0] !== firstVersion) {
      // @ts-ignore
      return undefined;
    }
    switch (size) {
      case 8:
        return this.raw.getInt8(offset);
      case 16:
        return this.raw.getInt16(offset);
      case 32:
        return this.raw.getInt32(offset);
    }
  }

  private readShiftJisString(
    firstVersion: string,
    offset: number,
    maxLength: number,
  ): string {
    if ([this.formatVersion, firstVersion].sort()[0] !== firstVersion) {
      // @ts-ignore
      return undefined;
    }
    const shiftJisBytes = new Uint8Array(maxLength);
    let charNum = 0;
    do {
      shiftJisBytes[charNum] = this.raw.getUint8(offset + charNum * 0x01);
      charNum++;
    } while (charNum < maxLength && shiftJisBytes[charNum - 1] !== 0x00);
    if (shiftJisBytes[0] !== 0x00) {
      const decoder = new TextDecoder('shift-jis');
      return decoder
        .decode(shiftJisBytes.subarray(0, charNum - 1))
        .replaceAll('＃', '#');
    }
    return '';
  }
}
