import { type ReplayData } from "@slippilab/common";

export const bgColor = "bg-zinc-50";
export const gridStrokeColor = "stroke-indigo-500";
export const timerFillColor = "fill-zinc-800";
export const playerHUDStrokeColor = "stroke-zinc-800";

export const stageStrokeColor = "stroke-zinc-800";
export const stageFillColor = "fill-zinc-800";
export const randallStrokeColor = "stroke-zinc-400";
export const flyGuyFillColor = "fill-red-500";

export const redTeamFillShades = ["fill-red-800", "fill-red-600"];
export const greenTeamFillShades = ["fill-green-800", "fill-green-600"];
export const blueTeamFillShades = ["fill-blue-800", "fill-blue-600"];
export const player1FillShades = ["fill-red-700", "fill-red-600"];
export const player2FillShades = ["fill-blue-700", "fill-blue-600"];
export const player3FillShades = ["fill-yellow-500", "fill-yellow-400"];
export const player4FillShades = ["fill-green-700", "fill-green-600"];

export const missedLCancelOutlineStrokeColor = "stroke-red-500";
export const invincibleOutlineStrokeColor = "stroke-blue-500";
export const defaultOutlineStrokeColor = "stroke-zinc-800";

export const shineFillColor = "fill-[#8abce9]";
export const laserStrokeColor = "stroke-red-500";
export const laserHitboxFillColor = "fill-red-500";
export const defaultItemFillColor = "fill-zinc-500";

export function getPlayerColor(
  replay: ReplayData,
  playerIndex: number,
  isNana: boolean,
): string {
  if (replay.settings.isTeams) {
    const settings = replay.settings.playerSettings[playerIndex];
    return [redTeamFillShades, greenTeamFillShades, blueTeamFillShades][
      settings.teamId
    ][isNana ? 1 : settings.teamShade];
  }
  return [
    player1FillShades,
    player2FillShades,
    player3FillShades,
    player4FillShades,
  ][playerIndex][isNana ? 1 : 0];
}
