import type { Vector } from './vector';

export type Line = [Vector, Vector];

// modified from ts-essentials, also made all functions return nonnullables
export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;
export type Builtin = Primitive | Function | Date | Error | RegExp;
export type DeepRequired<T> = T extends (...args: any) => any
  ? (...args: Parameters<T>) => DeepRequired<ReturnType<T>>
  : T extends Builtin
  ? NonNullable<T>
  : T extends Map<infer K, infer V>
  ? Map<DeepRequired<K>, DeepRequired<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepRequired<K>, DeepRequired<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepRequired<K>, DeepRequired<V>>
  : T extends Set<infer U>
  ? Set<DeepRequired<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepRequired<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepRequired<U>>
  : T extends Promise<infer U>
  ? Promise<DeepRequired<U>>
  : T extends {}
  ? {
      [K in keyof T]-?: DeepRequired<T[K]>;
    }
  : NonNullable<T>;

export interface Stage {
  lines: Line[];
  topRightBlastzone: Vector;
  bottomLeftBlastzone: Vector;
  getMovingPlatforms?: (frame: number) => Line[];
}

export interface Character {
  scale: number;
  shieldOffset: Vector;
  shieldSize: number; // Model Size * Shield Size attributes
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
] as const;
