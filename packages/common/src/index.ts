export interface Highlight {
  startFrame: number;
  endFrame: number;
}

export interface Replay {
  fileName: string;
  game: ReplayData;
  highlights: Highlight[];
}

/** */
export interface ReplayData {
  settings: GameSettings;
  /**
   * Starts at index -123. Player control starts at -39. Timer starts at 0.
   * TODO: Consider re-indexing to be 0-indexed, Array methods and iteration
   * will assume 0-indexing. frameNumber properties and UI could still map back
   * to be -123 indexed.
   */
  frames: Frame[];
  /** Cause of game end. To determine winner you must examine the last frame. */
  ending: GameEnding;
}
export interface GameSettings {
  /**
   * The version of the .slp spec that was used when the file was created. Some
   * fields are only present after certain versions.
   */
  replayFormatVersion: string;
  /** Timestamp of when the game started.
   *  ISO 8601 format (e.g. 2018-06-22T07:52:59Z)
   */
  startTimestamp: string;
  isTeams: boolean;
  stageId: number;
  isPal: boolean;
  /** Only set by Nintendont. Does not affect online matches */
  isFrozenStadium: boolean;
  playerSettings: PlayerSettings[];
  platform: 'dolphin' | 'console' | 'network';
  consoleNickname?: string;
  timerType: 'no timer' | 'counting down' | 'counting up';
  characterUiPlacesCount: number;
  gameType: 'time' | 'stock' | 'coin' | 'bonus';
  friendlyFireOn: boolean;
  isBreakTheTargetsOrTitleDemo: boolean;
  isClassicOrAdventureMode: boolean;
  isHomeRunContestOrEventMatch: boolean;
  isSingleButtonMode: boolean;
  timerCountsDuringPause: boolean;
  bombRain: boolean;
  itemSpawnRate: 'off' | 'very low' | 'low' | 'medium' | 'high' | 'very high';
  selfDestructScoreValue: number;
  timerStart: number;
  damageRatio: number;
}

export interface PlayerSettings {
  playerIndex: number;
  port: number;
  externalCharacterId: number;
  internalCharacterIds: number[];
  playerType: number;
  startStocks: number;
  costumeIndex: number;
  teamShade: number;
  handicap: number;
  teamId: number;
  staminaMode: boolean;
  silentCharacter: boolean;
  lowGravity: boolean;
  invisible: boolean;
  blackStockIcon: boolean;
  metal: boolean;
  startGameOnWarpPlatform: boolean;
  rumbleEnabled: boolean;
  cpuLevel: number;
  offenseRatio: number;
  defenseRatio: number;
  modelScale: number;
  controllerFix: 'None' | 'UCF' | 'Dween' | 'Mixed';
  nametag: string;
  displayName: string;
  connectCode: string;
}

export interface Frame {
  frameNumber: number;
  randomSeed: number;
  players: PlayerUpdate[];
  items: ItemUpdate[];
}

/** The inputs applied during this frame and the resulting state(s) */
export interface PlayerUpdate {
  frameNumber: number;
  playerIndex: number;
  inputs: PlayerInputs;
  nanaInputs?: PlayerInputs;
  state: PlayerState;
  nanaState?: PlayerState;
}

export interface PlayerInputs {
  frameNumber: number;
  playerIndex: number;
  isNana: boolean;
  physical: {
    a: boolean;
    b: boolean;
    x: boolean;
    y: boolean;
    z: boolean;
    start: boolean;
    dPadLeft: boolean;
    dPadRight: boolean;
    dPadDown: boolean;
    dPadUp: boolean;
    /** range [0, 1] */
    rTriggerAnalog: number;
    rTriggerDigial: boolean;
    /** range [0, 1] */
    lTriggerAnalog: number;
    lTriggerDigial: boolean;
  };
  processed: {
    a: boolean;
    b: boolean;
    x: boolean;
    y: boolean;
    z: boolean;
    start: boolean;
    dPadLeft: boolean;
    dPadRight: boolean;
    dPadDown: boolean;
    dPadUp: boolean;
    rTriggerDigial: boolean;
    lTriggerDigial: boolean;
    /** range [-1, 1] */
    joystickX: number;
    /** range [-1, 1] */
    joystickY: number;
    /** range [-1, 1] */
    cStickX: number;
    /** range [-1, 1] */
    cStickY: number;
    /** range [0, 1] */
    anyTrigger: number;
  };
}

export interface PlayerState {
  frameNumber: number;
  playerIndex: number;
  isNana: boolean;
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
  /**
   * L-cancel status is only populated on the first landing frame, not all of
   * them.
   * */
  lCancelStatus: 'successful' | 'missed' | undefined;
  hurtboxCollisionState: 'vulnerable' | 'invulnerable' | 'intangible';
  selfInducedAirXSpeed: number;
  selfInducedAirYSpeed: number;
  attackBasedXSpeed: number;
  attackBasedYSpeed: number;
  selfInducedGroundXSpeed: number;
  hitlagRemaining: number;
  isReflectActive: boolean;
  isFastfalling: boolean;
  isShieldActive: boolean;
  isInHitstun: boolean;
  isHittingShield: boolean;
  isPowershieldActive: boolean;
  isDead: boolean;
  isOffscreen: boolean;
}

export interface ItemUpdate {
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
  /** Mewtwo/Samus */
  isChargeShotLaunched: boolean;
  /** Mewtwo/Samus */
  chargeShotChargeLevel: number;
  owner: number;
}

/**
 * gameEndMethod is populated for versions >= 2.0.0.0
 * oldGameEndMethod is populated for versions < 2.0.0.0
 */
export interface GameEnding {
  gameEndMethod?: 'TIME!' | 'GAME!' | 'No Contest';
  oldGameEndMethod?: 'resolved' | 'unresolved';
  quitInitiator: number;
}
