import { SlippiGame } from '@slippi/slippi-js';

export type GamePredicate = (game: SlippiGame, playerIndex: number) => boolean;

export type Character = typeof characters[number];

export type Matchup = `${Character} vs ${Character}`;

export const isMatchup = (matchup: Matchup) => {
  const self = isCharacter(matchup.split(' vs ')[0] as Character);
  const opponent = vsCharacter(matchup.split(' vs ')[1] as Character);
  return (game: SlippiGame, playerIndex: number) =>
    self(game, playerIndex) && opponent(game, playerIndex);
};

export const isCharacter =
  (character: Character): GamePredicate =>
  (game: SlippiGame, playerIndex: number) =>
    game
      .getSettings()
      ?.players.some(
        (playerSettings) =>
          playerSettings.playerIndex === playerIndex &&
          playerSettings.characterId === characters.indexOf(character),
      ) ?? false;

export const vsCharacter =
  (character: Character): GamePredicate =>
  (game: SlippiGame, playerIndex: number) =>
    game
      .getSettings()
      ?.players.some(
        (playerSettings) =>
          playerSettings.playerIndex !== playerIndex &&
          playerSettings.characterId === characters.indexOf(character),
      ) ?? false;

// These are indexed by external ID. IDs are from
// https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
const characters = [
  'Captain Falcon',
  'Donkey Kong',
  'Fox',
  'Mr. Game & Watch',
  'Kirby',
  'Bowser',
  'Link',
  'Luigi',
  'Mario',
  'Marth',
  'Mewtwo',
  'Ness',
  'Peach',
  'Pikachu',
  'Ice Climbers',
  'Jigglypuff',
  'Samus',
  'Yoshi',
  'Zelda',
  'Sheik',
  'Falco',
  'Young Link',
  'Dr. Mario',
  'Roy',
  'Pichu',
  'Ganondorf',
] as const;

export type Stage = typeof stages[number];

export const isStage =
  (stage: Stage) => (game: SlippiGame, playerIndex: number) =>
    (game.getSettings()?.stageId ?? -1) === stages.indexOf(stage);

const tournamentStages: Stage[] = [
  'Battlefield',
  'Dream Land N64',
  'Final Destination',
  'Fountain of Dreams',
  'Pokémon Stadium',
  "Yoshi's Story",
];
export const isTournamentStage = (game: SlippiGame, playerIndex: number) =>
  tournamentStages
    .map((stage) => stages.indexOf(stage))
    .filter((stageId) => stageId === game.getSettings()?.stageId).length > 0;

// These are indexed by external ID. IDs are from
// https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
const stages = [
  'Dummy',
  'TEST',
  'Fountain of Dreams',
  'Pokémon Stadium',
  "Princess Peach's Castle",
  'Kongo Jungle',
  'Brinstar',
  'Corneria',
  "Yoshi's Story",
  'Onett',
  'Mute City',
  'Rainbow Cruise',
  'Jungle Japes',
  'Great Bay',
  'Hyrule Temple',
  'Brinstar Depths',
  "Yoshi's Island",
  'Green Greens',
  'Fourside',
  'Mushroom Kingdom I',
  'Mushroom Kingdom II',
  'Akaneia',
  'Venom',
  'Poké Floats',
  'Big Blue',
  'Icicle Mountain',
  'Icetop',
  'Flat Zone',
  'Dream Land N64',
  "Yoshi's Island N64",
  'Kongo Jungle N64',
  'Battlefield',
  'Final Destination',
] as const;

export const hasConnectCode =
  (connectCode: string) =>
  (game: SlippiGame, playerIndex: number): boolean =>
    game
      .getSettings()
      ?.players.some(
        (playerSettings) =>
          playerSettings.playerIndex === playerIndex &&
          playerSettings.connectCode === connectCode,
      ) ?? false;
