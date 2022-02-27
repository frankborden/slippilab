import type { ActionName } from '@slippilab/common';
import type { Vector } from './vector';

export type Line = [Vector, Vector];

export interface Stage {
  parts: [string, Vector[]][];
  topRightBlastzone: Vector;
  bottomLeftBlastzone: Vector;
  getMovingPlatforms?: (frame: number) => Line[];
}

export interface Character {
  scale: number;
  shieldOffset: Vector;
  shieldSize: number; // Model Size * Shield Size attributes
  animationMap: Map<ActionName, string>;
  specialsMap: Map<number, string>;
}

export type CharacterName = typeof characterNamesById[number];
// external ID
export const characterNamesById = [
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
// external ID
export const characterNamesByInternalId = [
  'Mario',
  'Fox',
  'Captain Falcon',
  'Donkey Kong',
  'Kirby',
  'Bowser',
  'Link',
  'Sheik',
  'Ness',
  'Peach',
  'Popo',
  'Nana',
  'Pikachu',
  'Samus',
  'Yoshi',
  'Jigglypuff',
  'Mewtwo',
  'Luigi',
  'Marth',
  'Zelda',
  'Young Link',
  'Dr. Mario',
  'Falco',
  'Pichu',
  'Mr. Game & Watch',
  'Ganondorf',
  'Roy',
] as const;
