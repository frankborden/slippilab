import type { Character } from '../common';
import { Vector } from '../vector';

export const jigglypuff: Character = {
  scale: 0.24 / 4.5,
  // shieldOffset: new Vector(0 / 4.5, 22 / 4.5),
  shieldOffset: new Vector(0, 22 / 4.5), // guess

  shieldSize: 0.94 * 13.125,
};
