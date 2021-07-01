import { FrameEntryType, GameStartType } from "../types";
import { ActionCountsType } from "./common";
import { StatComputer } from "./stats";
export declare class ActionsComputer implements StatComputer<ActionCountsType[]> {
    private playerPermutations;
    private state;
    setup(settings: GameStartType): void;
    processFrame(frame: FrameEntryType): void;
    fetch(): ActionCountsType[];
}
