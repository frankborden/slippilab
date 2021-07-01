import { GameStartType, PostFrameUpdateType } from "../types";
export interface StatsType {
    gameComplete: boolean;
    lastFrame: number;
    playableFrameCount: number;
    stocks: StockType[];
    conversions: ConversionType[];
    combos: ComboType[];
    actionCounts: ActionCountsType[];
    overall: OverallType[];
}
export interface RatioType {
    count: number;
    total: number;
    ratio: number | null;
}
export interface PlayerIndexedType {
    playerIndex: number;
    opponentIndex: number;
}
export interface DurationType {
    startFrame: number;
    endFrame?: number | null;
}
export interface DamageType {
    startPercent: number;
    currentPercent: number;
    endPercent?: number | null;
}
export interface StockType extends DurationType, DamageType {
    playerIndex: number;
    count: number;
    deathAnimation?: number | null;
}
export interface MoveLandedType {
    playerIndex: number;
    frame: number;
    moveId: number;
    hitCount: number;
    damage: number;
}
export interface ComboType extends DurationType, DamageType {
    playerIndex: number;
    moves: MoveLandedType[];
    didKill: boolean;
    lastHitBy: number | null;
}
export interface ConversionType extends ComboType {
    openingType: string;
}
export interface ActionCountsType {
    playerIndex: number;
    wavedashCount: number;
    wavelandCount: number;
    airDodgeCount: number;
    dashDanceCount: number;
    spotDodgeCount: number;
    ledgegrabCount: number;
    rollCount: number;
    lCancelCount: {
        success: number;
        fail: number;
    };
    grabCount: {
        success: number;
        fail: number;
    };
    throwCount: {
        up: number;
        forward: number;
        back: number;
        down: number;
    };
    groundTechCount: {
        backward: number;
        forward: number;
        neutral: number;
        fail: number;
    };
    wallTechCount: {
        success: number;
        fail: number;
    };
}
export interface InputCountsType {
    buttons: number;
    triggers: number;
    joystick: number;
    cstick: number;
    total: number;
}
export interface OverallType {
    playerIndex: number;
    inputCounts: InputCountsType;
    conversionCount: number;
    totalDamage: number;
    killCount: number;
    successfulConversions: RatioType;
    inputsPerMinute: RatioType;
    digitalInputsPerMinute: RatioType;
    openingsPerKill: RatioType;
    damagePerOpening: RatioType;
    neutralWinRatio: RatioType;
    counterHitRatio: RatioType;
    beneficialTradeRatio: RatioType;
}
export declare enum State {
    DAMAGE_START = 75,
    DAMAGE_END = 91,
    CAPTURE_START = 223,
    CAPTURE_END = 232,
    GUARD_START = 178,
    GUARD_END = 182,
    GROUNDED_CONTROL_START = 14,
    GROUNDED_CONTROL_END = 24,
    SQUAT_START = 39,
    SQUAT_END = 41,
    DOWN_START = 183,
    DOWN_END = 198,
    TECH_START = 199,
    TECH_END = 204,
    DYING_START = 0,
    DYING_END = 10,
    CONTROLLED_JUMP_START = 24,
    CONTROLLED_JUMP_END = 34,
    GROUND_ATTACK_START = 44,
    GROUND_ATTACK_END = 64,
    AERIAL_ATTACK_START = 65,
    AERIAL_ATTACK_END = 74,
    ROLL_FORWARD = 233,
    ROLL_BACKWARD = 234,
    SPOT_DODGE = 235,
    AIR_DODGE = 236,
    ACTION_WAIT = 14,
    ACTION_DASH = 20,
    ACTION_KNEE_BEND = 24,
    GUARD_ON = 178,
    TECH_MISS_UP = 183,
    TECH_MISS_DOWN = 191,
    NEUTRAL_TECH = 199,
    FORWARD_TECH = 200,
    BACKWARD_TECH = 201,
    WALL_TECH = 202,
    MISSED_WALL_TECH = 247,
    DASH = 20,
    TURN = 18,
    LANDING_FALL_SPECIAL = 43,
    JUMP_FORWARD = 25,
    JUMP_BACKWARD = 26,
    FALL_FORWARD = 30,
    FALL_BACKWARD = 31,
    GRAB = 212,
    GRAB_WAIT = 216,
    PUMMEL = 217,
    CLIFF_CATCH = 252,
    THROW_UP = 221,
    THROW_FORWARD = 219,
    THROW_DOWN = 222,
    THROW_BACK = 220,
    DAMAGE_FALL = 38,
    BARREL_WAIT = 293,
    COMMAND_GRAB_RANGE1_START = 266,
    COMMAND_GRAB_RANGE1_END = 304,
    COMMAND_GRAB_RANGE2_START = 327,
    COMMAND_GRAB_RANGE2_END = 338,
    COMMAND_GRAB_RANGE3_START = 375,
    COMMAND_GRAB_RANGE3_END = 382
}
export declare const Timers: {
    PUNISH_RESET_FRAMES: number;
    RECOVERY_RESET_FRAMES: number;
    COMBO_STRING_RESET_FRAMES: number;
};
export declare function getSinglesPlayerPermutationsFromSettings(settings: GameStartType): PlayerIndexedType[];
export declare function didLoseStock(frame: PostFrameUpdateType, prevFrame: PostFrameUpdateType): boolean;
export declare function isInControl(state: number): boolean;
export declare function isTeching(state: number): boolean;
export declare function isDown(state: number): boolean;
export declare function isDamaged(state: number): boolean;
export declare function isGrabbed(state: number): boolean;
export declare function isCommandGrabbed(state: number): boolean;
export declare function isDead(state: number): boolean;
export declare function calcDamageTaken(frame: PostFrameUpdateType, prevFrame: PostFrameUpdateType): number;
