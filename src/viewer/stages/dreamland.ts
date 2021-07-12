import type { Stage } from '../common';
import { Vector } from '../vector';

export const dreamland: Stage = {
  lines: [
    // ground
    [new Vector(-77.25, 0), new Vector(77.25, 0)],
    // platforms
    [new Vector(-61.393, 30.142), new Vector(-31.725, 30.142)],
    [new Vector(-19.018, 51.425), new Vector(19.017, 51.425)],
    [new Vector(31.704, 30.243), new Vector(63.075, 30.243)],
    // ceiling
    [new Vector(-65.75, -36), new Vector(65.75, -36)],
    // wallL
    [new Vector(-77.25, 0), new Vector(-76.5, -11)],
    [new Vector(-76.5, -11), new Vector(-65.75, -36)],
    // wallR
    [new Vector(77.25, 0), new Vector(76.5, -11)],
    [new Vector(76.5, -11), new Vector(65.75, -36)],
  ],
  topRightBlastzone: new Vector(255, 250),
  bottomLeftBlastzone: new Vector(-255, -123),
};
