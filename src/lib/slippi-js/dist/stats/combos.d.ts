/// <reference types="node" />
import { EventEmitter } from "events";
import { FrameEntryType, FramesType, GameStartType } from "../types";
import { ComboType } from "./common";
import { StatComputer } from "./stats";
export declare enum ComboEvent {
    COMBO_START = "COMBO_START",
    COMBO_EXTEND = "COMBO_EXTEND",
    COMBO_END = "COMBO_END"
}
export declare class ComboComputer extends EventEmitter implements StatComputer<ComboType[]> {
    private playerPermutations;
    private state;
    private combos;
    private settings;
    setup(settings: GameStartType): void;
    processFrame(frame: FrameEntryType, allFrames: FramesType): void;
    fetch(): ComboType[];
}
