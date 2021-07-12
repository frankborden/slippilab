import type { Stage } from '../common';
import { Vector } from '../vector';

export const finalDestination: Stage = {
  lines: [
    // ground
    [new Vector(-85.6, 0), new Vector(85.6, 0)],
    // platforms - N/A
    // ceiling
    [new Vector(-50, -55), new Vector(-45, -56)],
    [new Vector(-45, -56), new Vector(45, -56)],
    [new Vector(45, -56), new Vector(50, -55)],
    // wallL
    [new Vector(-85.6, 0), new Vector(-85.6, -10)],
    [new Vector(-85.6, -10), new Vector(-65, -20)],
    [new Vector(-65, -20), new Vector(-65, -30)],
    [new Vector(-65, -30), new Vector(-60, -47)],
    [new Vector(-60, -47), new Vector(-50, -55)],
    // wallR
    [new Vector(85.6, 0), new Vector(85.6, -10)],
    [new Vector(85.6, -10), new Vector(65, -20)],
    [new Vector(65, -20), new Vector(65, -30)],
    [new Vector(65, -30), new Vector(60, -47)],
    [new Vector(60, -47), new Vector(50, -55)],
  ],
  topRightBlastzone: new Vector(246, 188),
  bottomLeftBlastzone: new Vector(-246, -140),
};
