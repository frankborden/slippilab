import type { Stage } from '../stages/stage';
import { Box2D } from '../utils/Box2D';
import { Vec2D } from '../utils/Vec2D';

/*eslint indent:0*/

export const dreamland: Stage = {
  name: 'dreamland',
  box: [],
  polygon: [
    [
      new Vec2D(-77.25, 0),
      new Vec2D(77.25, 0),
      new Vec2D(76.5, -11),
      new Vec2D(65.75, -36),
      new Vec2D(-65.75, -36),
      new Vec2D(-76.5, -11),
      new Vec2D(-77.25, 0),
    ],
  ],
  platform: [
    [new Vec2D(-61.393, 30.142), new Vec2D(-31.725, 30.142)],
    [new Vec2D(-19.018, 51.425), new Vec2D(19.017, 51.425)],
    [new Vec2D(31.704, 30.243), new Vec2D(63.075, 30.243)],
  ],
  ground: [[new Vec2D(-77.25, 0), new Vec2D(77.25, 0)]],
  ceiling: [[new Vec2D(-65.75, -36), new Vec2D(65.75, -36)]],
  wallL: [
    [new Vec2D(-77.25, 0), new Vec2D(-76.5, -11)],
    [new Vec2D(-76.5, -11), new Vec2D(-65.75, -36)],
  ],
  wallR: [
    [new Vec2D(77.25, 0), new Vec2D(76.5, -11)],
    [new Vec2D(76.5, -11), new Vec2D(65.75, -36)],
  ],
  startingPoint: [
    new Vec2D(-60, 50),
    new Vec2D(60, 50),
    new Vec2D(-40, 50),
    new Vec2D(40, 50),
  ],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [
    new Vec2D(-60, 50),
    new Vec2D(60, 50),
    new Vec2D(-40, 50),
    new Vec2D(40, 50),
  ],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-255, -123], [255, 250]),
  ledge: [
    ['ground', 0, 0],
    ['ground', 0, 1],
  ],
  ledgePos: [new Vec2D(-77.25, 0), new Vec2D(77.25, 0)],
  scale: 3.5,
  offset: new Vec2D(600, 500),
  movingPlats: [],
  drawInit: function (context: CanvasRenderingContext2D) {},
  draw: function (context: CanvasRenderingContext2D, frame: number) {},
};
