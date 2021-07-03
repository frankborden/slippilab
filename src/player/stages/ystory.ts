import type { Stage } from '../stages/stage';
import { Box2D } from '../utils/Box2D';
import { Vec2D } from '../utils/Vec2D';

/*eslint indent:0*/

export const yoshis: Stage = {
  name: 'ystory',
  box: [],
  polygon: [
    [
      new Vec2D(-56, -3.5),
      new Vec2D(-39, 0),
      new Vec2D(39, 0),
      new Vec2D(56, -3.5),
      new Vec2D(56, -7),
      new Vec2D(55, -8),
      new Vec2D(54, -11),
      new Vec2D(53, -12),
      new Vec2D(53, -27),
      new Vec2D(54, -28),
      new Vec2D(54, -30),
      new Vec2D(53, -31),
      new Vec2D(53, -46),
      new Vec2D(54, -47),
      new Vec2D(54, -100),
      new Vec2D(-54, -100),
      new Vec2D(-54, -47),
      new Vec2D(-53, -46),
      new Vec2D(-53, -31),
      new Vec2D(-54, -30),
      new Vec2D(-54, -28),
      new Vec2D(-53, -27),
      new Vec2D(-53, -12),
      new Vec2D(-54, -11),
      new Vec2D(-55, -8),
      new Vec2D(-56, -7),
      new Vec2D(-56, -3.5),
    ],
  ],
  platform: [
    [new Vec2D(-103.6, -33.25), new Vec2D(-91.7, -33.25)],
    [new Vec2D(-59.5, 23.45), new Vec2D(-28, 23.45)],
    [new Vec2D(28, 23.45), new Vec2D(59.5, 23.45)],
    [new Vec2D(-15.75, 42), new Vec2D(15.75, 42)],
  ],
  ground: [
    [new Vec2D(-56, -3.5), new Vec2D(-39, 0)],
    [new Vec2D(-39, 0), new Vec2D(39, 0)],
    [new Vec2D(39, 0), new Vec2D(56, -3.5)],
  ],
  ceiling: [],
  wallL: [
    [new Vec2D(-56, -3.5), new Vec2D(-56, -7)],
    [new Vec2D(-56, -7), new Vec2D(-55, -8)],
    [new Vec2D(-55, -8), new Vec2D(-54, -11)],
    [new Vec2D(-54, -11), new Vec2D(-53, -12)],
    [new Vec2D(-53, -12), new Vec2D(-53, -27)],
    [new Vec2D(-53, -27), new Vec2D(-54, -28)],
    [new Vec2D(-54, -28), new Vec2D(-54, -30)],
    [new Vec2D(-54, -30), new Vec2D(-53, -31)],
    [new Vec2D(-53, -31), new Vec2D(-53, -46)],
    [new Vec2D(-53, -46), new Vec2D(-54, -47)],
    [new Vec2D(-54, -47), new Vec2D(-54, -100)],
  ],
  wallR: [
    [new Vec2D(56, -3.5), new Vec2D(56, -7)],
    [new Vec2D(56, -7), new Vec2D(55, -8)],
    [new Vec2D(55, -8), new Vec2D(54, -11)],
    [new Vec2D(54, -11), new Vec2D(53, -12)],
    [new Vec2D(53, -12), new Vec2D(53, -27)],
    [new Vec2D(53, -27), new Vec2D(54, -28)],
    [new Vec2D(54, -28), new Vec2D(54, -30)],
    [new Vec2D(54, -30), new Vec2D(53, -31)],
    [new Vec2D(53, -31), new Vec2D(53, -46)],
    [new Vec2D(53, -46), new Vec2D(54, -47)],
    [new Vec2D(54, -47), new Vec2D(54, -100)],
  ],
  startingPoint: [
    new Vec2D(-42, 30),
    new Vec2D(42, 30),
    new Vec2D(-15, 15),
    new Vec2D(15, 15),
  ],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [
    new Vec2D(-42, 30),
    new Vec2D(42, 30),
    new Vec2D(-20, 30),
    new Vec2D(-20, 30),
  ],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-175.7, -91], [173.6, 168]),
  ledge: [
    ['ground', 0, 0],
    ['ground', 2, 1],
  ],
  ledgePos: [new Vec2D(-56, -3.5), new Vec2D(56, -3.5)],
  scale: 5,
  offset: new Vec2D(600, 430),
  connected: [
    [
      [null, ['g', 1]],
      [
        ['g', 0],
        ['g', 2],
      ],
      [['g', 1], null],
    ],
    [
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  ],
  movingPlats: [0],
  randall: {
    path: [
      new Vec2D(-95.9, -33.25),
      // bottom right corner
      new Vec2D(95.69, -33.25),
      new Vec2D(96.72, -32.69),
      new Vec2D(97.3, -31.675),

      //top right corner
      new Vec2D(97.3, -15.225),
      new Vec2D(96.72, -14.21),
      new Vec2D(95.69, -13.65),

      //top left corner
      new Vec2D(-96.04, -13.65),
      new Vec2D(-97.07, -14.21),
      new Vec2D(-97.65, -15.225),

      //bottom left corner
      new Vec2D(-97.65, -31.675),
      new Vec2D(-97.07, -32.69),
      new Vec2D(-96.04, -33.25),

      new Vec2D(-95.9, -33.25),
    ],
    /*Corner offsets
    +1.61, 0
    +0.58, -0.56
    -1.575*/
    // start: new Vec2D(-95.9, -33.25),
    width: 11.9, //5.95 * 2
    speed: 0.354843,
    // -0.354859
    // left_edge: -97.65,
    // right_edge: 97.3,
    // top_edge: -13.65,
    // bottom_edge: -33.25,

    path_offset: -5.13,

    total_distance: 0,
    segments: [],
  },
  drawInit: function (context: CanvasRenderingContext2D) {
    context.strokeStyle = 'rgba(255,255,255,0.3)';
    context.lineWidth = 1;
    context.beginPath();
    var o = this.randall!.path_offset;
    var p1 = this.randall!.path[0];
    context.moveTo(
      p1.x * this.scale + this.offset.x,
      (p1.y + o) * -this.scale + this.offset.y,
    );
    for (var i = 1; i < this.randall!.path.length; i++) {
      var p = this.randall!.path[i];
      context.lineTo(
        p.x * this.scale + this.offset.x,
        (p.y + o) * -this.scale + this.offset.y,
      );
    }
    context.lineTo(
      p1.x * this.scale + this.offset.x,
      (p1.y + o) * -this.scale + this.offset.y,
    );
    context.closePath();
    context.stroke();

    // RANDALL SEGMENT SETUP!

    var totalDist = 0;
    for (var i = 0; i < this.randall!.path.length - 1; i++) {
      var p1 = this.randall!.path[i];
      var p2 =
        this.randall!.path[i == this.randall!.path.length - 1 ? 0 : i + 1];
      var distsqr = Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
      totalDist += Math.sqrt(distsqr);
    }
    this.total_distance = totalDist;

    totalDist = 0;
    for (var i = 0; i < this.randall!.path.length - 1; i++) {
      var p1 = this.randall!.path[i];
      var p2 =
        this.randall!.path[i == this.randall!.path.length - 1 ? 0 : i + 1];
      var dist_vec = new Vec2D(p2.x - p1.x, p2.y - p1.y);
      var dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      var start_fract = totalDist / this.total_distance;
      totalDist += dist;
      var end_fract = totalDist / this.total_distance;
      this.randall!.segments[i] = {
        start: new Vec2D(p1.x, p1.y),
        end: new Vec2D(p2.x, p2.y),
        dist: dist_vec,
        start_fraction: start_fract,
        end_fraction: end_fract,
        total_fraction: end_fract - start_fract,
      };
    }
  },
  draw: function (context: CanvasRenderingContext2D, frame: number) {
    // FIND CURRENT RANDALL POSITION
    var pos = new Vec2D(0, 0);
    var fract = ((frame + 123) % 1200) / 1200;

    for (var i = 0; i < this.randall!.segments.length; i++) {
      var seg = this.randall!.segments[i];
      if (fract >= seg.start_fraction && fract <= seg.end_fraction) {
        var fract_along = (fract - seg.start_fraction) / seg.total_fraction;
        pos.x = seg.start.x + seg.dist.x * fract_along;
        pos.y = seg.start.y + seg.dist.y * fract_along;
        break;
      }
    }

    context.strokeStyle = '#4794c6';
    context.fillStyle = 'rgba(255,255,255,0.3)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(
      (pos.x - this.randall!.width / 2) * this.scale + this.offset.x,
      pos.y * -this.scale + this.offset.y,
    );
    context.lineTo(
      (pos.x + this.randall!.width / 2) * this.scale + this.offset.x,
      pos.y * -this.scale + this.offset.y,
    );
    context.lineTo(
      (pos.x + this.randall!.width / 2) * this.scale + this.offset.x,
      (pos.y + this.randall!.path_offset) * -this.scale + this.offset.y,
    );
    context.lineTo(
      (pos.x + this.randall!.width / 4) * this.scale + this.offset.x,
      (pos.y + this.randall!.path_offset * 2) * -this.scale + this.offset.y,
    );
    context.lineTo(
      (pos.x - this.randall!.width / 4) * this.scale + this.offset.x,
      (pos.y + this.randall!.path_offset * 2) * -this.scale + this.offset.y,
    );
    context.lineTo(
      (pos.x - this.randall!.width / 2) * this.scale + this.offset.x,
      (pos.y + this.randall!.path_offset) * -this.scale + this.offset.y,
    );
    context.lineTo(
      (pos.x - this.randall!.width / 2) * this.scale + this.offset.x,
      pos.y * -this.scale + this.offset.y,
    );
    context.closePath();
    context.fill();
    context.stroke();
  },
};
