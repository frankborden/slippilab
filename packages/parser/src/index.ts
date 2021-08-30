import { decode } from '@shelacek/ubjson';

/**
 * This is a quick-n-dirty parser for use in the browser.
 * It is based off of the replay format SPEC up to 3.9.0.0.
 * It is incomplete, I have left out things I don't need right now.
 * slippi-js can work too if your build tool de-node-ifies it enough.
 * TODO: don't crash on old format versions, just skip the missing
 * fields.
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
  connectCode: string;
  costumeIndex: number;
  displayName: string;
  externalCharacterId: number;
  nametag: string;
  playerType: number;
  teamId: number;
  teamShade: number;
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
// interface GeckoListEvent {}
// interface MessageSplitterEvent {
//   actualSize: number;
//   fixedSizeBlock: any;
//   internalCommand: number;
//   lastMessage: true;
// }
export interface PlayerNames {
  displayName: string;
  connectCode: string;
}
export interface PlayerCharacters {
  [internalCharacterId: number]: number;
}
export interface PlayerMetadata {
  characters: PlayerCharacters;
  names: PlayerNames;
}
export interface Metadata {
  startAt: string;
  lastFrame: number;
  players: { [playerIndex: number]: PlayerMetadata };
  playedOn: string;
  consoleNick: string;
}
export interface Frame {
  frameNumber: number;
  start: FrameStartEvent;
  end: FrameBookendEvent;
  players: { pre: PreFrameUpdateEvent; post: PostFrameUpdateEvent }[];
  items: ItemUpdateEvent[];
}

export class Game {
  public metadata: Metadata;
  private raw: DataView;
  private commandPayloadSizes: EventPayloadsEvent = {};
  public gameStart!: GameStartEvent;
  public gameEnd!: GameEndEvent;
  public frames: Frame[] = [];
  constructor(fileBuffer: ArrayBuffer) {
    const baseJson = decode(fileBuffer, { useTypedArrays: true });
    this.metadata = baseJson.metadata;
    this.raw = new DataView(
      baseJson.raw.buffer,
      baseJson.raw.byteOffset,
      baseJson.raw.byteLength,
    );

    // The first two events are always Event Payloads and Game Start.

    let offset = 0x00;
    let command, size, event;
    while (offset < this.raw.byteLength) {
      command = this.getUint(8, offset);
      switch (command) {
        case 0x35:
          this.commandPayloadSizes = this.parseEventPayloadsEvent(offset);
          break;
        case 0x36:
          this.gameStart = this.parseGameStartEvent(offset);
          break;
        case 0x37:
          event = this.parsePreFrameUpdateEvent(offset);
          this.frames[event.frameNumber].players[event.playerIndex] = {
            pre: event,
            //@ts-ignore
            post: undefined,
          };
          break;
        case 0x38:
          event = this.parsePostFrameUpdateEvent(offset);
          this.frames[event.frameNumber].players[event.playerIndex].post =
            event;
          break;
        case 0x39:
          event = this.parseGameEndEvent(offset);
          this.gameEnd = event;
          break;
        case 0x3a:
          event = this.parseFrameStartEvent(offset);
          this.frames[event.frameNumber] = {
            frameNumber: event.frameNumber,
            start: event,
            //@ts-ignore
            end: undefined,
            players: [],
            items: [],
          };
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
      size = this.commandPayloadSizes[command];
      offset = offset + size + 0x01;
    }
  }

  private parseEventPayloadsEvent(offset: number): EventPayloadsEvent {
    const commandByte = this.getUint(8, offset + 0x00);
    const commandPayloadSizes: { [commandByte: number]: number } = {};
    const eventPayloadsPayloadSize = this.getUint(8, offset + 0x01);
    commandPayloadSizes[commandByte] = eventPayloadsPayloadSize;
    const listOffset = offset + 0x02;
    for (
      let i = listOffset;
      i < eventPayloadsPayloadSize + listOffset - 0x01;
      i += 0x03
    ) {
      const commandByte = this.getUint(8, i + 0x00);
      const payloadSize = this.getUint(16, i + 0x01);
      commandPayloadSizes[commandByte] = payloadSize;
    }
    return commandPayloadSizes;
  }

  private parseGameStartEvent(offset: number): GameStartEvent {
    const event: GameStartEvent = {
      isTeams: Boolean(this.getUint(8, offset + 0x0d)),
      playerSettings: [],
      replayFormatVersion: [
        this.getUint(8, offset + 0x01),
        this.getUint(8, offset + 0x02),
        this.getUint(8, offset + 0x03),
        this.getUint(8, offset + 0x04),
      ].join('.'),
      stageId: this.getUint(16, offset + 0x13),
    };
    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      const playerType = this.getUint(8, offset + 0x66 + 0x24 * playerIndex);
      if (playerType === 3) {
        continue;
      }
      event.playerSettings[playerIndex] = {
        playerIndex: playerIndex,
        // TODO replace double width # with single width #
        connectCode: 'TODO',
        // connectCode: this.readShiftJisString(
        //   offset + 0x221 + 0x0a * playerIndex,
        //   10,
        // ),
        costumeIndex: this.getUint(8, offset + 0x68 + 0x24 * playerIndex),
        displayName: 'TODO',
        // displayName: this.readShiftJisString(
        //   offset + 0x1a5 + 0x1f * playerIndex,
        //   16,
        // ),
        externalCharacterId: this.getUint(
          8,
          offset + 0x65 + 0x24 * playerIndex,
        ),
        // TODO verify
        nametag: this.readShiftJisString(
          offset + 0x161 + 0x10 * playerIndex,
          9,
        ),
        playerType,
        teamId: this.getUint(8, offset + 0x6e + 0x24 * playerIndex),
        teamShade: this.getUint(8, offset + 0x6c + 0x24 * playerIndex),
      };
    }
    return event;
  }

  private parseFrameStartEvent(offset: number): FrameStartEvent {
    return {
      frameNumber: this.getInt(32, offset + 0x01),
      randomSeed: this.getUint(32, offset + 0x05),
    };
  }

  private parsePreFrameUpdateEvent(offset: number): PreFrameUpdateEvent {
    return {
      frameNumber: this.getInt(32, offset + 0x01),
      playerIndex: this.getUint(8, offset + 0x05),
      isFollower: Boolean(this.getUint(8, offset + 0x06)),
      actionStateId: this.getUint(16, offset + 0x0b),
      xPosition: this.getFloat(32, offset + 0x0d),
      yPosition: this.getFloat(32, offset + 0x11),
      facingDirection: this.getFloat(32, offset + 0x15),
      joystickX: this.getFloat(32, offset + 0x19),
      joystickY: this.getFloat(32, offset + 0x1d),
      cStickX: this.getFloat(32, offset + 0x21),
      cStickY: this.getFloat(32, offset + 0x25),
      trigger: this.getFloat(32, offset + 0x29),
      processedButtons: this.getUint(32, offset + 0x2d),
      physicalButtons: this.getUint(16, offset + 0x31),
      physicalLTrigger: this.getFloat(32, offset + 0x33),
      physicalRTrigger: this.getFloat(32, offset + 0x37),
      percent: this.getFloat(32, offset + 0x3c),
    };
  }

  private parsePostFrameUpdateEvent(offset: number): PostFrameUpdateEvent {
    return {
      frameNumber: this.getInt(32, offset + 0x01),
      playerIndex: this.getUint(8, offset + 0x05),
      isFollower: Boolean(this.getUint(8, offset + 0x06)),
      internalCharacterId: this.getUint(8, offset + 0x07),
      actionStateId: this.getUint(16, offset + 0x08),
      xPosition: this.getFloat(32, offset + 0x0a),
      yPosition: this.getFloat(32, offset + 0x0e),
      facingDirection: this.getFloat(32, offset + 0x12),
      percent: this.getFloat(32, offset + 0x16),
      shieldSize: this.getFloat(32, offset + 0x1a),
      lastHittingAttackId: this.getUint(8, offset + 0x1e),
      currentComboCount: this.getUint(8, offset + 0x1f),
      lastHitBy: this.getUint(8, offset + 0x20),
      stocksRemaining: this.getUint(8, offset + 0x21),
      actionStateFrameCounter: this.getFloat(32, offset + 0x22),
      isGrounded: !Boolean(this.getUint(8, offset + 0x2f)),
      lastGroundId: this.getUint(8, offset + 0x30),
      jumpsRemaining: this.getUint(8, offset + 0x32),
      lCancelStatus: this.getUint(8, offset + 0x33),
      hurtboxCollisionState: this.getUint(8, offset + 0x34),
      selfInducedAirXSpeed: this.getFloat(32, offset + 0x35),
      selfInducedAirYSpeed: this.getFloat(32, offset + 0x39),
      attackBasedXSpeed: this.getFloat(32, offset + 0x3d),
      attackBasedYSpeed: this.getFloat(32, offset + 0x41),
      selfInducedGroundXSpeed: this.getFloat(32, offset + 0x45),
      hitlagRemaining: this.getFloat(32, offset + 0x49),
    };
  }

  private parseItemUpdateEvent(offset: number): ItemUpdateEvent {
    return {
      frameNumber: this.getInt(32, offset + 0x01),
      typeId: this.getUint(16, offset + 0x05),
      state: this.getUint(8, offset + 0x07),
      facingDirection: this.getFloat(32, offset + 0x08),
      xVelocity: this.getFloat(32, offset + 0x0c),
      yVelocity: this.getFloat(32, offset + 0x10),
      xPosition: this.getFloat(32, offset + 0x14),
      yPosition: this.getFloat(32, offset + 0x18),
      damageTaken: this.getUint(16, offset + 0x1c),
      expirationTimer: this.getFloat(32, offset + 0x1e),
      spawnId: this.getUint(32, offset + 0x22),
      samusMissileType: this.getUint(8, offset + 0x26),
      peachTurnipFace: this.getUint(8, offset + 0x27),
      owner: this.getInt(8, offset + 0x2a),
    };
  }

  private parseFrameBookendEvent(offset: number): FrameBookendEvent {
    return {
      frameNumber: this.getInt(32, offset + 0x01),
      latestFinalizedFrame: this.getInt(32, offset + 0x05),
    };
  }

  private parseGameEndEvent(offset: number): GameEndEvent {
    return {
      gameEndMethod: this.getUint(8, offset + 0x01),
      quitInitiator: this.getInt(8, offset + 0x02),
    };
  }

  private getUint(size: 8 | 16 | 32, offset: number): number {
    if (this.raw.byteLength - this.raw.byteOffset < offset) {
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

  private getFloat(size: 32 | 64, offset: number): number {
    if (this.raw.byteLength - this.raw.byteOffset < offset) {
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

  private getInt(size: 8 | 16 | 32, offset: number): number {
    if (this.raw.byteLength - this.raw.byteOffset < offset) {
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

  private readShiftJisString(offset: number, maxLength: number): string {
    const shiftJisBytes = new Uint8Array(maxLength);
    let charNum = 0;
    do {
      shiftJisBytes[charNum] = this.raw.getUint8(offset + charNum * 0x01);
      charNum++;
    } while (shiftJisBytes[charNum - 1] !== 0x00);
    if (shiftJisBytes[0] !== 0x00) {
      const decoder = new TextDecoder('shift-jis');
      return decoder.decode(shiftJisBytes.subarray(0, charNum - 1));
    }
    return '';
  }
}
