import { marth } from './marth';
import { falcon } from './falcon';
import { fox } from './fox';
import { jigglypuff } from './jigglypuff';
import { falco } from './falco';
import type { Vector } from '../common';

export interface CharacterData {
  animID: number;
  scale: number;
  bubbleScale: number;
  shieldOffset: Vector;
}

export const characterDataById: { [characterId: number]: CharacterData } = {
  0: falcon,
  2: fox,
  9: marth,
  15: jigglypuff,
  20: falco,
};

export type Character = typeof characters[number];
// external ID
export const characters = [
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
