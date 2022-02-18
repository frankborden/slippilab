import type { ReplayData } from '@slippilab/common';
import { ids } from '@slippilab/common';

export type GamePredicate = (game: ReplayData, playerIndex: number) => boolean;

export type Character = typeof ids.characterNameByExternalId[number];

export type Matchup = `${Character} vs ${Character}`;

export function isMatchup(matchup: Matchup): GamePredicate {
  const self = isCharacter(matchup.split(' vs ')[0] as Character);
  const opponent = vsCharacter(matchup.split(' vs ')[1] as Character);
  return (game: ReplayData, playerIndex: number) =>
    self(game, playerIndex) && opponent(game, playerIndex);
}

export function isCharacter(character: Character): GamePredicate {
  return (game: ReplayData, playerIndex: number) =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex === playerIndex &&
        playerSettings.externalCharacterId ===
          ids.characterNameByExternalId.indexOf(character),
    ) ?? false;
}

export function vsCharacter(character: Character): GamePredicate {
  return (game: ReplayData, playerIndex: number) =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex !== playerIndex &&
        playerSettings.externalCharacterId ===
          ids.characterNameByExternalId.indexOf(character),
    ) ?? false;
}

export type Stage = typeof ids.stageNameByExternalId[number];

export function isStage(stage: Stage): GamePredicate {
  return (game: ReplayData, _playerIndex: number) =>
    game.settings.stageId === ids.stageNameByExternalId.indexOf(stage);
}
const tournamentStages: Stage[] = [
  'Battlefield',
  'Dream Land N64',
  'Final Destination',
  'Fountain of Dreams',
  'Pokémon Stadium',
  "Yoshi's Story",
];
export function isTournamentStage(game: ReplayData, _playerIndex: number) {
  return (
    tournamentStages
      .map((stage) => ids.stageNameByExternalId.indexOf(stage))
      .filter((stageId) => stageId === game.settings.stageId).length > 0
  );
}

export function hasConnectCode(connectCode: string): GamePredicate {
  return (game: ReplayData, playerIndex: number): boolean =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex === playerIndex &&
        playerSettings.connectCode === connectCode,
    ) ?? false;
}
