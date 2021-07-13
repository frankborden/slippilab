import type { Character } from '../common';
import { Vector } from '../vector';

export const marth: Character = {
  scale: 0.49 / 4.5,
  // shieldOffset: new Vector(5 / 4.5, 40 / 4.5),
  shieldOffset: new Vector(0, 35 / 4.5), // guess

  shieldSize: 1.15 * 11.75,
};
