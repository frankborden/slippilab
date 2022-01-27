/** */
export interface ReplayData {
  settings: GameSettings;
  /**
   * Player control starts at 84. Timer starts at 123.
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
  /**
   * Timestamp of when the game started.
   * ISO 8601 format (e.g. 2018-06-22T07:52:59Z)
   */
  startTimestamp: string;
  isTeams: boolean;
  /** External stage ID */
  stageId: number;
  isPal: boolean;
  /** Only set by Nintendont. Does not affect online matches */
  isFrozenStadium: boolean;
  /** Indexed by playerIndex (port - 1). Do not check length */
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
  /** Indexed by playerIndex (port - 1). Do not check length */
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

/**
 * Note: internal and external lists do not match.
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const characterNameByExternalId = [
  'Captain Falcon',
  'Donkey Kong',
  'Fox',
  'Mr. Game & Watch',
  'Kirby',
  'Bowser',
  'Link',
  'Luigi',
  'Mario',
  'Marth',
  'Mewtwo',
  'Ness',
  'Peach',
  'Pikachu',
  'Ice Climbers',
  'Jigglypuff',
  'Samus',
  'Yoshi',
  'Zelda',
  'Sheik',
  'Falco',
  'Young Link',
  'Dr. Mario',
  'Roy',
  'Pichu',
  'Ganondorf',
  // NPCs and perma-SoPo here
] as const;

/**
 * Note: internal and external lists do not match.
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const characterNameByInternalId = [
  'Mario',
  'Fox',
  'Captain Falcon',
  'Donkey Kong',
  'Kirby',
  'Bowser',
  'Link',
  'Sheik',
  'Ness',
  'Peach',
  'Popo',
  'Nana',
  'Pikachu',
  'Samus',
  'Yoshi',
  'Jigglypuff',
  'Mewtwo',
  'Luigi',
  'Marth',
  'Zelda',
  'Young Link',
  'Dr. Mario',
  'Falco',
  'Pichu',
  'Mr. Game & Watch',
  'Ganondorf',
  'Roy',
  // NPCs here
] as const;

/**
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const stageNameByExternalId = [
  'Dummy',
  'TEST',
  'Fountain of Dreams',
  'Pokémon Stadium',
  "Princess Peach's Castle",
  'Kongo Jungle',
  'Brinstar',
  'Corneria',
  "Yoshi's Story",
  'Onett',
  'Mute City',
  'Rainbow Cruise',
  'Jungle Japes',
  'Great Bay',
  'Hyrule Temple',
  'Brinstar Depths',
  "Yoshi's Island",
  'Green Greens',
  'Fourside',
  'Mushroom Kingdom I',
  'Mushroom Kingdom II',
  'Akaneia',
  'Venom',
  'Poké Floats',
  'Big Blue',
  'Icicle Mountain',
  'Icetop',
  'Flat Zone',
  'Dream Land N64',
  "Yoshi's Island N64",
  'Kongo Jungle N64',
  'Battlefield',
  'Final Destination',
] as const;
