import { marth } from './marth';
import { falcon } from './falcon';
import { fox } from './fox';
import { jigglypuff } from './jigglypuff';
import { falco } from './falco';
import type { Character } from '../common';

export { createPlayerRender } from './render';
export const supportedCharactersById: { [characterId: number]: Character } = {
  0: falcon,
  2: fox,
  9: marth,
  15: jigglypuff,
  20: falco,
};
