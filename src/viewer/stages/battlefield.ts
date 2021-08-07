import type { Line, Stage } from '../common';
import { Vector } from '../vector';

export const battlefield: Stage = {
  parts: [
    // main stage
    [
      '#372C4C',
      [
        new Vector(-68.4, 0),
        new Vector(68.4, 0),
        new Vector(65, -6),
        new Vector(36, -19),
        new Vector(39, -21),
        new Vector(33, -25),
        new Vector(30, -29),
        new Vector(29, -35),
        new Vector(10, -40),
        new Vector(10, -30),
        new Vector(-10, -30),
        new Vector(-10, -40),
        new Vector(-29, -35),
        new Vector(-30, -29),
        new Vector(-33, -25),
        new Vector(-39, -21),
        new Vector(-36, -19),
        new Vector(-65, -6),
        new Vector(-68.4, 0),
      ],
    ],
    // left platform
    ['#372C4C', [new Vector(-57.6, 27.2), new Vector(-20, 27.2)]],
    // right platform
    ['#372C4C', [new Vector(20, 27.2), new Vector(57.6, 27.2)]],
    // top platform
    ['#372C4C', [new Vector(-18.8, 54.4), new Vector(18.8, 54.4)]],
  ],
  topRightBlastzone: new Vector(224, 200),
  bottomLeftBlastzone: new Vector(-224, -108.8),
};
