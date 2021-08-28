import type { Stage } from '../common';
import { Vector } from '../vector';

export const pokemonStadium: Stage = {
  parts: [
    // main stage
    ['#5CAA7B', [new Vector(-87.75, 0), new Vector(87.75, 0)]],
    [
      '#7B7B7B',
      [
        new Vector(87.75, 0),
        new Vector(87.75, -4),
        new Vector(73.75, -15),
        new Vector(73.75, -17.75),
        new Vector(60, -17.75),
        new Vector(60, -38),
        new Vector(15, -60),
        new Vector(15, -112),
        new Vector(-15, -112),
        new Vector(-15, -60),
        new Vector(-60, -38),
        new Vector(-60, -17.75),
        new Vector(-73.75, -17.75),
        new Vector(-73.75, -15),
        new Vector(-87.75, -4),
        new Vector(-87.75, 0),
      ],
    ],
    // left platform
    ['#7B7B7B', [new Vector(-55, 25), new Vector(-25, 25)]],
    // right platform
    ['#7B7B7B', [new Vector(25, 25), new Vector(55, 25)]],
  ],
  topRightBlastzone: new Vector(230, 180),
  bottomLeftBlastzone: new Vector(-230, -111),
};
