import { sheik } from './sheik';
import { peach } from './peach';
import type { Character } from '../common';
import { fox } from './fox';
import { falco } from './falco';
import { falcon } from './falcon';
import { marth } from './marth';
import { jigglypuff } from './jigglypuff';

export { createPlayerRender } from './render';
export const supportedCharactersById: { [characterId: number]: Character } = {
  0: falcon,
  2: fox,
  9: marth,
  12: peach,
  15: jigglypuff,
  19: sheik,
  20: falco,
};
