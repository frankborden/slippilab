import { Vector } from '../common';
import type { Stage } from './stage';

export const fountain: Stage = {
  lines: [
    // ground
    [new Vector(-63.33, 0.62), new Vector(-53.5, 0.62)],
    [new Vector(-53.5, 0.62), new Vector(-51, 0)],
    [new Vector(-51, 0), new Vector(51, 0)],
    [new Vector(51, 0), new Vector(53.5, 0.62)],
    [new Vector(53.5, 0.62), new Vector(63.33, 0.62)],
    // platforms
    [new Vector(-14.25, 42.75), new Vector(14.25, 42.75)],
    [new Vector(21, 22.125), new Vector(49.5, 22.125)],
    [new Vector(-49.5, 16.125), new Vector(-21, 16.125)],
    // ceiling
    [new Vector(-19, -49.5), new Vector(-41, -42)],
    [new Vector(19, -49.5), new Vector(41, -42)],
    // wallL
    [new Vector(-63.35, 0.62), new Vector(-63.35, -4.5)],
    [new Vector(-63.35, -4.5), new Vector(-59.33, -15)],
    [new Vector(-59.33, -15), new Vector(-56.9, -19.5)],
    [new Vector(-56.9, -19.5), new Vector(-55, -27)],
    [new Vector(-55, -27), new Vector(-52, -32)],
    [new Vector(-52, -32), new Vector(-48, -38)],
    [new Vector(-48, -38), new Vector(-41, -42)],
    [new Vector(-19, -49.5), new Vector(-13, -54.5)],
    [new Vector(-13, -54.5), new Vector(-10, -62)],
    [new Vector(-10, -62), new Vector(-8.8, -72)],
    [new Vector(-8.8, -72), new Vector(-8.8, -150)],
    // wallR
    [new Vector(63.35, 0.62), new Vector(63.35, -4.5)],
    [new Vector(63.35, -4.5), new Vector(59.33, -15)],
    [new Vector(59.33, -15), new Vector(56.9, -19.5)],
    [new Vector(56.9, -19.5), new Vector(55, -27)],
    [new Vector(55, -27), new Vector(52, -32)],
    [new Vector(52, -32), new Vector(48, -38)],
    [new Vector(48, -38), new Vector(41, -42)],
    [new Vector(19, -49.5), new Vector(13, -54.5)],
    [new Vector(13, -54.5), new Vector(10, -62)],
    [new Vector(10, -62), new Vector(8.8, -72)],
    [new Vector(8.8, -72), new Vector(8.8, -150)],
  ],
  scale: 5,
  offset: new Vector(600, -450),
  topRightBlastzone: new Vector(198.75, 202.5),
  bottomLeftBlastzone: new Vector(-198.75, -146.25),
};
