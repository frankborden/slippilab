import type { Character } from '../common';
import { Vector } from '../vector';

export const falco: Character = {
  scale: 0.47 / 4.5,
  // shieldOffset: new Vector(10 / 4.5, 40 / 4.5),
  shieldOffset: new Vector(10 / 4.5, 40 / 4.5), // guess
  shieldSize: 1.1 * 12.5,
};
