import { GameStartType } from "../types";
import { ConversionType, OverallType, StockType } from "./common";
import { PlayerInput } from "./inputs";
export declare function generateOverallStats(settings: GameStartType, inputs: PlayerInput[], stocks: StockType[], conversions: ConversionType[], playableFrameCount: number): OverallType[];
