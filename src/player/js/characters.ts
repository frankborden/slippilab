import { Vec2D } from '../utils/Vec2D';

export const externalCharacterIDs: { [id: number]: string } = {
  0x00: 'FALCON', // Captain Falcon
  //0x01   // Donkey Kong
  0x02: 'FOX', // Fox
  //0x03   // Mr. Game & Watch
  //0x04   // Kirby
  //0x05   // Bowser
  //0x06   // Link
  //0x07   // Luigi
  //0x08   // Mario
  0x09: 'MARTH', // Marth
  //0x0A   // Mewtwo
  //0x0B   // Ness
  //0x0C   // Peach
  //0x0D   // Pikachu
  //0x0E   // Ice Climbers
  0x0f: 'PUFF', // Jigglypuff
  //0x10   // Samus
  //0x11   // Yoshi
  //0x12   // Zelda
  //0x13   // Sheik
  0x14: 'FALCO', // Falco
  //0x15   // Young Link
  //0x16   // Dr. Mario
  //0x17   // Roy
  //0x18   // Pichu
  //0x19   // Ganondorf
  //0x1A   // Master Hand
  //0x1C   // Wireframe Female (Girl)

  //0x1D   // Giga Bower
  //0x1E   // Crazy Hand
  //0x1F   // Sandbag
  //0x20   // Popo
};

export function characterExists(val: number) {
  return !(externalCharacterIDs[val] == null);
}

export interface Character {
  animID: number;
  scale: number;
  bubbleScale: number;
  shieldOffset: Vec2D;
}

export const characters: { [characterName: string]: Character } = {
  FALCON: {
    animID: 4,
    scale: 0.485,
    bubbleScale: 0.3,
    shieldOffset: new Vec2D(5, 34),
  },

  FOX: {
    animID: 2,
    scale: 0.35,
    bubbleScale: 0.3,
    shieldOffset: new Vec2D(5, 34),
  },

  MARTH: {
    animID: 0,
    scale: 0.49,
    bubbleScale: 0.32,
    shieldOffset: new Vec2D(5, 40),
  },

  PUFF: {
    animID: 1,
    scale: 0.24,
    bubbleScale: 0.168,
    shieldOffset: new Vec2D(0, 22),
  },

  FALCO: {
    animID: 3,
    scale: 0.47,
    bubbleScale: 0.3,
    shieldOffset: new Vec2D(10, 40),
  },
};
