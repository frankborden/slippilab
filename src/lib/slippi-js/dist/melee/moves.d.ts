export interface Move {
    id: number;
    name: string;
    shortName: string;
}
export declare const UnknownMove: Move;
export declare function getMoveInfo(moveId: number): Move;
export declare function getMoveShortName(moveId: number): string;
export declare function getMoveName(moveId: number): string;
