import { FrameEntryType, FramesType, GameStartType } from "../types";
export interface StatComputer<T> {
    setup(settings: GameStartType): void;
    processFrame(newFrame: FrameEntryType, allFrames: FramesType): void;
    fetch(): T;
}
export interface StatOptions {
    processOnTheFly: boolean;
}
export declare class Stats {
    private options;
    private lastProcessedFrame;
    private frames;
    private players;
    private allComputers;
    constructor(options?: StatOptions);
    /**
     * Should reset the frames to their default values.
     */
    setup(settings: GameStartType): void;
    register(...computer: StatComputer<unknown>[]): void;
    process(): void;
    addFrame(frame: FrameEntryType): void;
}
