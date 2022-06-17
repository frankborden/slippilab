import type { ReplayData } from "~/common/types";
import {
  characterNameByExternalId,
  stageNameByExternalId,
  ExternalCharacterName,
} from "~/common/ids";

export type GamePredicate = (game: ReplayData, playerIndex: number) => boolean;

export type Matchup = `${ExternalCharacterName} vs ${ExternalCharacterName}`;

export function isMatchup(matchup: Matchup): GamePredicate {
  const self = isCharacter(matchup.split(" vs ")[0] as ExternalCharacterName);
  const opponent = vsCharacter(
    matchup.split(" vs ")[1] as ExternalCharacterName
  );
  return (game: ReplayData, playerIndex: number) =>
    self(game, playerIndex) && opponent(game, playerIndex);
}

export function isCharacter(character: ExternalCharacterName): GamePredicate {
  return (game: ReplayData, playerIndex: number) =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex === playerIndex &&
        playerSettings.externalCharacterId ===
          characterNameByExternalId.indexOf(character)
    ) ?? false;
}

export function vsCharacter(character: ExternalCharacterName): GamePredicate {
  return (game: ReplayData, playerIndex: number) =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex !== playerIndex &&
        playerSettings.externalCharacterId ===
          characterNameByExternalId.indexOf(character)
    ) ?? false;
}

export type Stage = typeof stageNameByExternalId[number];

export function isStage(stage: Stage): GamePredicate {
  return (game: ReplayData, _playerIndex: number) =>
    game.settings.stageId === stageNameByExternalId.indexOf(stage);
}
const tournamentStages: Stage[] = [
  "Battlefield",
  "Dream Land N64",
  "Final Destination",
  "Fountain of Dreams",
  "Pokémon Stadium",
  "Yoshi's Story",
];
export function isTournamentStage(
  game: ReplayData,
  _playerIndex: number
): boolean {
  return (
    tournamentStages
      .map((stage) => stageNameByExternalId.indexOf(stage))
      .filter((stageId) => stageId === game.settings.stageId).length > 0
  );
}

export function hasConnectCode(connectCode: string): GamePredicate {
  return (game: ReplayData, playerIndex: number): boolean =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex === playerIndex &&
        playerSettings.connectCode === connectCode
    ) ?? false;
}
