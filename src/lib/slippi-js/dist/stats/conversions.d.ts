/// <reference types="node" />
import { EventEmitter } from "events";
import { FrameEntryType, FramesType, GameStartType } from "../types";
import { ConversionType } from "./common";
import { StatComputer } from "./stats";
export declare class ConversionComputer extends EventEmitter implements StatComputer<ConversionType[]> {
    private playerPermutations;
    private conversions;
    private state;
    private metadata;
    private settings;
    constructor();
    setup(settings: GameStartType): void;
    processFrame(frame: FrameEntryType, allFrames: FramesType): void;
    fetch(): ConversionType[];
    private _populateConversionTypes;
}
