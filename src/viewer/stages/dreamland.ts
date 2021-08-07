import type { Stage } from '../common';
import { Vector } from '../vector';

export const dreamland: Stage = {
  parts: [
    [
      '#086810',
      [
        new Vector(-76.5, -11),
        new Vector(-77.25, 0),
        new Vector(77.25, 0),
        new Vector(76.5, -11),
      ],
    ],
    [
      '#C88C36',
      [
        new Vector(76.5, -11),
        new Vector(65.75, -36),
        new Vector(-65.75, -36),
        new Vector(-76.5, -11),
      ],
    ],
    // left platform
    ['#C88C36', [new Vector(-61.393, 30.142), new Vector(-31.725, 30.142)]],
    // right platform
    ['#C88C36', [new Vector(31.704, 30.243), new Vector(63.075, 30.243)]],
    // top platform
    ['#C88C36', [new Vector(-19.018, 51.425), new Vector(19.017, 51.425)]],
  ],
  topRightBlastzone: new Vector(255, 250),
  bottomLeftBlastzone: new Vector(-255, -123),
};
