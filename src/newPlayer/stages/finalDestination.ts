import { Vector } from '../common';
import type { Stage } from './stage';

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
  scale: 4.5,
  offset: new Vector(600, -400),
};
