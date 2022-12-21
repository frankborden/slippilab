/** */
export interface ReplayData {
  readonly settings: GameSettings;
  /**
   * Player control starts at 84. Timer starts at 123.
   */
  readonly frames: Frame[];
  /** Cause of game end. To determine winner you must examine the last frame. */
  readonly ending: GameEnding;
}
export interface GameSettings {
  /**
   * The version of the .slp spec that was used when the file was created. Some
   * fields are only present after certain versions.
   */
  readonly replayFormatVersion: string;
  /**
   * Timestamp of when the game started.
   * ISO 8601 format (e.g. 2018-06-22T07:52:59Z)
   */
  readonly startTimestamp: string;
  readonly isTeams: boolean;
  /** External stage ID */
  readonly stageId: number;
  readonly isPal: boolean;
  /** Only set by Nintendont. Does not affect online matches */
  readonly isFrozenStadium: boolean;
  /** Indexed by playerIndex (port - 1). Do not check length */
  readonly playerSettings: PlayerSettings[];
  readonly platform: "dolphin" | "console" | "network";
  readonly consoleNickname?: string;
  readonly timerType: "no timer" | "counting down" | "counting up";
  readonly characterUiPlacesCount: number;
  readonly gameType: "time" | "stock" | "coin" | "bonus";
  readonly friendlyFireOn: boolean;
  readonly isBreakTheTargetsOrTitleDemo: boolean;
  readonly isClassicOrAdventureMode: boolean;
  readonly isHomeRunContestOrEventMatch: boolean;
  readonly isSingleButtonMode: boolean;
  readonly timerCountsDuringPause: boolean;
  readonly bombRain: boolean;
  readonly itemSpawnRate:
    | "off"
    | "very low"
    | "low"
    | "medium"
    | "high"
    | "very high";
  readonly selfDestructScoreValue: number;
  readonly timerStart: number;
  readonly damageRatio: number;
}

export interface PlayerSettings {
  readonly playerIndex: number;
  readonly port: number;
  readonly externalCharacterId: number;
  readonly internalCharacterIds: number[];
  readonly playerType: number;
  readonly startStocks: number;
  readonly costumeIndex: number;
  readonly teamShade: number;
  readonly handicap: number;
  readonly teamId: number;
  readonly staminaMode: boolean;
  readonly silentCharacter: boolean;
  readonly lowGravity: boolean;
  readonly invisible: boolean;
  readonly blackStockIcon: boolean;
  readonly metal: boolean;
  readonly startGameOnWarpPlatform: boolean;
  readonly rumbleEnabled: boolean;
  readonly cpuLevel: number;
  readonly offenseRatio: number;
  readonly defenseRatio: number;
  readonly modelScale: number;
  readonly controllerFix: "None" | "UCF" | "Dween" | "Mixed";
  readonly nametag: string;
  readonly displayName: string;
  readonly connectCode: string;
}

export interface Frame {
  readonly frameNumber: number;
  readonly randomSeed: number;
  /** Indexed by playerIndex (port - 1). Do not check length */
  readonly players: PlayerUpdate[];
  readonly items: ItemUpdate[];
}

/** The inputs applied during this frame and the resulting state(s) */
export interface PlayerUpdate {
  readonly frameNumber: number;
  readonly playerIndex: number;
  readonly inputs: PlayerInputs;
  readonly nanaInputs?: PlayerInputs;
  readonly state: PlayerState;
  readonly nanaState?: PlayerState;
}

export type PlayerUpdateWithNana = Required<PlayerUpdate>;

export interface PlayerInputs {
  readonly frameNumber: number;
  readonly playerIndex: number;
  readonly isNana: boolean;
  readonly physical: {
    readonly a: boolean;
    readonly b: boolean;
    readonly x: boolean;
    readonly y: boolean;
    readonly z: boolean;
    readonly start: boolean;
    readonly dPadLeft: boolean;
    readonly dPadRight: boolean;
    readonly dPadDown: boolean;
    readonly dPadUp: boolean;
    /** range [0, 1] */
    readonly rTriggerAnalog: number;
    readonly rTriggerDigital: boolean;
    /** range [0, 1] */
    readonly lTriggerAnalog: number;
    readonly lTriggerDigital: boolean;
  };
  readonly processed: {
    readonly a: boolean;
    readonly b: boolean;
    readonly x: boolean;
    readonly y: boolean;
    readonly z: boolean;
    readonly start: boolean;
    readonly dPadLeft: boolean;
    readonly dPadRight: boolean;
    readonly dPadDown: boolean;
    readonly dPadUp: boolean;
    readonly rTriggerDigital: boolean;
    readonly lTriggerDigital: boolean;
    /** range [-1, 1] */
    readonly joystickX: number;
    /** range [-1, 1] */
    readonly joystickY: number;
    /** range [-1, 1] */
    readonly cStickX: number;
    /** range [-1, 1] */
    readonly cStickY: number;
    /** range [0, 1] */
    readonly anyTrigger: number;
  };
}

export interface PlayerState {
  readonly frameNumber: number;
  readonly playerIndex: number;
  readonly isNana: boolean;
  readonly internalCharacterId: number;
  readonly actionStateId: number;
  readonly xPosition: number;
  readonly yPosition: number;
  readonly facingDirection: number;
  readonly percent: number;
  readonly shieldSize: number;
  readonly lastHittingAttackId: number;
  readonly currentComboCount: number;
  readonly lastHitBy: number;
  readonly stocksRemaining: number;
  readonly actionStateFrameCounter: number;
  readonly hitstunRemaining: number;
  readonly isGrounded: boolean;
  readonly lastGroundId: number;
  readonly jumpsRemaining: number;
  /**
   * L-cancel status is only populated on the first landing frame, not all of
   * them.
   * */
  readonly lCancelStatus: "successful" | "missed" | undefined;
  readonly hurtboxCollisionState: "vulnerable" | "invulnerable" | "intangible";
  readonly selfInducedAirXSpeed: number;
  readonly selfInducedAirYSpeed: number;
  readonly attackBasedXSpeed: number;
  readonly attackBasedYSpeed: number;
  readonly selfInducedGroundXSpeed: number;
  readonly hitlagRemaining: number;
  readonly isReflectActive: boolean;
  readonly isFastfalling: boolean;
  readonly isShieldActive: boolean;
  readonly isInHitstun: boolean;
  readonly isHittingShield: boolean;
  readonly isPowershieldActive: boolean;
  readonly isDead: boolean;
  readonly isOffscreen: boolean;
}

export interface ItemUpdate {
  readonly frameNumber: number;
  readonly typeId: number;
  readonly state: number;
  readonly facingDirection: number;
  readonly xVelocity: number;
  readonly yVelocity: number;
  readonly xPosition: number;
  readonly yPosition: number;
  readonly damageTaken: number;
  readonly expirationTimer: number;
  readonly spawnId: number;
  readonly samusMissileType: number;
  readonly peachTurnipFace: number;
  /** Mewtwo/Samus */
  readonly isChargeShotLaunched: boolean;
  /** Mewtwo/Samus */
  readonly chargeShotChargeLevel: number;
  readonly owner: number;
}

/**
 * gameEndMethod is populated for versions >= 2.0.0.0
 * oldGameEndMethod is populated for versions < 2.0.0.0
 */
export interface GameEnding {
  readonly gameEndMethod?: "TIME!" | "GAME!" | "No Contest";
  readonly oldGameEndMethod?: "resolved" | "unresolved";
  readonly quitInitiator: number;
}
