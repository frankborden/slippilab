import { charactersExt, stages } from "~/common/model/names";
import type { ReplayData } from "~/common/model/types";

export type GamePredicate = (game: ReplayData, playerIndex: number) => boolean;
type ExternalCharacterName = (typeof charactersExt)[number];

export type Matchup = `${ExternalCharacterName} vs ${ExternalCharacterName}`;

export function isMatchup(matchup: Matchup): GamePredicate {
  const self = isCharacter(matchup.split(" vs ")[0] as ExternalCharacterName);
  const opponent = vsCharacter(
    matchup.split(" vs ")[1] as ExternalCharacterName,
  );
  return (game: ReplayData, playerIndex: number) =>
    self(game, playerIndex) && opponent(game, playerIndex);
}

export function isCharacter(character: ExternalCharacterName): GamePredicate {
  return (game: ReplayData, playerIndex: number) =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex === playerIndex &&
        charactersExt[playerSettings.externalCharacterId] === character,
    ) ?? false;
}

export function vsCharacter(character: ExternalCharacterName): GamePredicate {
  return (game: ReplayData, playerIndex: number) =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex !== playerIndex &&
        charactersExt[playerSettings.externalCharacterId] === character,
    ) ?? false;
}

export type Stage = (typeof stages)[number];
export function isStage(stage: Stage): GamePredicate {
  return (game: ReplayData, _playerIndex: number) =>
    stages[game.settings.stageId] === stage;
}

export function hasConnectCode(connectCode: string): GamePredicate {
  return (game: ReplayData, playerIndex: number): boolean =>
    game.settings.playerSettings.some(
      (playerSettings) =>
        playerSettings.playerIndex === playerIndex &&
        playerSettings.connectCode === connectCode,
    ) ?? false;
}
