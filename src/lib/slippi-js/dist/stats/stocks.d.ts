import { FrameEntryType, FramesType, GameStartType } from "../types";
import { StockType } from "./common";
import { StatComputer } from "./stats";
export declare class StockComputer implements StatComputer<StockType[]> {
    private state;
    private playerPermutations;
    private stocks;
    setup(settings: GameStartType): void;
    processFrame(frame: FrameEntryType, allFrames: FramesType): void;
    fetch(): StockType[];
}
