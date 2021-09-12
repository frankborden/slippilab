import type { Character } from '../common';
import { sheik } from './sheik';
import { peach } from './peach';
import { fox } from './fox';
import { falco } from './falco';
import { captainFalcon } from './captainFalcon';
import { marth } from './marth';
import { jigglypuff } from './jigglypuff';
import { pikachu } from './pikachu';
import { samus } from './samus';
import { luigi } from './luigi';
import { mario } from './mario';
import { doctorMario } from './doctorMario';
import { donkeyKong } from './donkeyKong';
import { roy } from './roy';
import { link } from './link';
import { youngLink } from './youngLink';
import { iceClimbers } from './iceClimbers';
import { yoshi } from './yoshi';
import { pichu } from './pichu';
import { zelda } from './zelda';
import { bowser } from './bowser';
import { ness } from './ness';
import { mewtwo } from './mewtwo';
import { ganondorf } from './ganondorf';

export { createPlayerRender } from './render';
export const supportedCharactersById: { [characterId: number]: Character } = {
  0: captainFalcon,
  1: donkeyKong,
  2: fox,
  5: bowser,
  6: link,
  7: luigi,
  8: mario,
  9: marth,
  10: mewtwo,
  11: ness,
  12: peach,
  13: pikachu,
  14: iceClimbers,
  15: jigglypuff,
  16: samus,
  17: yoshi,
  18: zelda,
  19: sheik,
  20: falco,
  21: youngLink,
  22: doctorMario,
  23: roy,
  24: pichu,
  25: ganondorf,
};
