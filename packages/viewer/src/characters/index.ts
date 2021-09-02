import type { Character } from '../common';
import { sheik } from './sheik';
import { peach } from './peach';
import { fox } from './fox';
import { falco } from './falco';
import { falcon } from './falcon';
import { marth } from './marth';
import { jigglypuff } from './jigglypuff';
import { pikachu } from './pikachu';
import { samus } from './samus';
import { luigi } from './luigi';

export { createPlayerRender } from './render';
export const supportedCharactersById: { [characterId: number]: Character } = {
  0: falcon,
  2: fox,
  7: luigi,
  9: marth,
  12: peach,
  13: pikachu,
  15: jigglypuff,
  16: samus,
  19: sheik,
  20: falco,
};
