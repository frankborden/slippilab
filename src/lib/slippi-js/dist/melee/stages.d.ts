export interface StageInfo {
    id: number;
    name: string;
}
export declare const UnknownStage: StageInfo;
export declare function getStageInfo(stageId: number): StageInfo;
export declare function getStageName(stageId: number): string;
