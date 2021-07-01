import { Vector } from '../common';
import type { Stage } from './stage';

export const yoshisStory: Stage = {
  lines: [
    // ground
    [new Vector(-56, -3.5), new Vector(-39, 0)],
    [new Vector(-39, 0), new Vector(39, 0)],
    [new Vector(39, 0), new Vector(56, -3.5)],
    // platforms
    // [new Vector(-103.6, -33.25), new Vector(-91.7, -33.25)], Randall
    [new Vector(-59.5, 23.45), new Vector(-28, 23.45)],
    [new Vector(28, 23.45), new Vector(59.5, 23.45)],
    [new Vector(-15.75, 42), new Vector(15.75, 42)],
    // ceiling
    // wallL
    [new Vector(-56, -3.5), new Vector(-56, -7)],
    [new Vector(-56, -7), new Vector(-55, -8)],
    [new Vector(-55, -8), new Vector(-54, -11)],
    [new Vector(-54, -11), new Vector(-53, -12)],
    [new Vector(-53, -12), new Vector(-53, -27)],
    [new Vector(-53, -27), new Vector(-54, -28)],
    [new Vector(-54, -28), new Vector(-54, -30)],
    [new Vector(-54, -30), new Vector(-53, -31)],
    [new Vector(-53, -31), new Vector(-53, -46)],
    [new Vector(-53, -46), new Vector(-54, -47)],
    [new Vector(-54, -47), new Vector(-54, -100)],
    // wallR
    [new Vector(56, -3.5), new Vector(56, -7)],
    [new Vector(56, -7), new Vector(55, -8)],
    [new Vector(55, -8), new Vector(54, -11)],
    [new Vector(54, -11), new Vector(53, -12)],
    [new Vector(53, -12), new Vector(53, -27)],
    [new Vector(53, -27), new Vector(54, -28)],
    [new Vector(54, -28), new Vector(54, -30)],
    [new Vector(54, -30), new Vector(53, -31)],
    [new Vector(53, -31), new Vector(53, -46)],
    [new Vector(53, -46), new Vector(54, -47)],
    [new Vector(54, -47), new Vector(54, -100)],
  ],
  scale: 5,
  offset: new Vector(600, -430),
  topRightBlastzone: new Vector(173.6, 169),
  bottomLeftBlastzone: new Vector(-175.7, -91),
};
