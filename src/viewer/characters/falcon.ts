import type { Character } from '../common';
import { Vector } from '../vector';

export const falcon: Character = {
  scale: 0.485 / 4.5,
  // shieldOffset: new Vector(5 / 4.5, 34 / 4.5),
  shieldOffset: new Vector(0, 42 / 4.5), // guess

  shieldSize: 0.97 * 15,
};
