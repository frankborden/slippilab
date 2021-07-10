import { Stage, Vector } from '../common';

export const battlefield: Stage = {
  lines: [
    // ground
    [new Vector(-68.4, 0), new Vector(68.4, 0)],
    // platforms
    [new Vector(-57.6, 27.2), new Vector(-20, 27.2)],
    [new Vector(20, 27.2), new Vector(57.6, 27.2)],
    [new Vector(-18.8, 54.4), new Vector(18.8, 54.4)],
    // ceiling
    [new Vector(-65, -6), new Vector(-36, -19)],
    [new Vector(-29, -35), new Vector(-10, -40)],
    [new Vector(-10, -30), new Vector(10, -30)],
    [new Vector(65, -6), new Vector(36, -19)],
    [new Vector(29, -35), new Vector(10, -40)],
    // wallL
    [new Vector(-68.4, 0), new Vector(-65, -6)],
    [new Vector(-36, -19), new Vector(-39, -21)],
    [new Vector(-39, -21), new Vector(-33, -25)],
    [new Vector(-33, -25), new Vector(-30, -29)],
    [new Vector(-30, -29), new Vector(-29, -35)],
    [new Vector(10, -30), new Vector(10, -40)],
    // wallR
    [new Vector(68.4, 0), new Vector(65, -6)],
    [new Vector(36, -19), new Vector(39, -21)],
    [new Vector(39, -21), new Vector(33, -25)],
    [new Vector(33, -25), new Vector(30, -29)],
    [new Vector(30, -29), new Vector(29, -35)],
    [new Vector(-10, -30), new Vector(-10, -40)],
  ],
  topRightBlastzone: new Vector(224, 200),
  bottomLeftBlastzone: new Vector(-224, -108.8),
};
