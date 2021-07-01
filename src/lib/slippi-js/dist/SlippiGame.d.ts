/// <reference types="node" />
import { StatOptions, StatsType } from "./stats";
import { FrameEntryType, FramesType, GameEndType, GameStartType, MetadataType } from "./types";
/**
 * Slippi Game class that wraps a file
 */
export declare class SlippiGame {
    private input;
    private metadata;
    private finalStats;
    private parser;
    private readPosition;
    private actionsComputer;
    private conversionComputer;
    private comboComputer;
    private stockComputer;
    private inputComputer;
    private statsComputer;
    constructor(input: string | Buffer | ArrayBuffer, opts?: StatOptions);
    private _process;
    /**
     * Gets the game settings, these are the settings that describe the starting state of
     * the game such as characters, stage, etc.
     */
    getSettings(): GameStartType | null;
    getLatestFrame(): FrameEntryType | null;
    getGameEnd(): GameEndType | null;
    getFrames(): FramesType;
    getStats(): StatsType | null;
    getMetadata(): MetadataType | null;
    getFilePath(): string | null;
}
