import type { ReplayData } from '@slippilab/common';
import { ids } from '@slippilab/common';

export type GamePredicate = (game: ReplayData, playerIndex: number) => boolean;

export type Character = typeof ids.characterNameByExternalId[number];

export type Matchup = `${Character} vs ${Character}`;

export const isMatchup = (matchup: Matchup) => {
  const self = isCharacter(matchup.split(' vs ')[0] as Character);
  const opponent = vsCharacter(matchup.split(' vs ')[1] as Character);
  return (game: ReplayData, playerIndex: number) =>
    self(game, playerIndex) && opponent(game, playerIndex);
};

export const isCharacter =
  (character: Character): GamePredicate =>
  (game: ReplayData, playerIndex: number) =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex === playerIndex &&
        playerSettings.externalCharacterId ===
          ids.characterNameByExternalId.indexOf(character),
    ) ?? false;

export const vsCharacter =
  (character: Character): GamePredicate =>
  (game: ReplayData, playerIndex: number) =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex !== playerIndex &&
        playerSettings.externalCharacterId ===
          ids.characterNameByExternalId.indexOf(character),
    ) ?? false;

export type Stage = typeof ids.stageNameByExternalId[number];

export const isStage =
  (stage: Stage) => (game: ReplayData, _playerIndex: number) =>
    game.settings.stageId === ids.stageNameByExternalId.indexOf(stage);

const tournamentStages: Stage[] = [
  'Battlefield',
  'Dream Land N64',
  'Final Destination',
  'Fountain of Dreams',
  'Pokémon Stadium',
  "Yoshi's Story",
];
export const isTournamentStage = (game: ReplayData, _playerIndex: number) =>
  tournamentStages
    .map((stage) => ids.stageNameByExternalId.indexOf(stage))
    .filter((stageId) => stageId === game.settings.stageId).length > 0;

export const hasConnectCode =
  (connectCode: string) =>
  (game: ReplayData, playerIndex: number): boolean =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex === playerIndex &&
        playerSettings.connectCode === connectCode,
    ) ?? false;
