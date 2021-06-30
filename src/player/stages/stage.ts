import type { Box2D } from '../utils/Box2D';
import type { Vec2D } from '../utils/Vec2D';

export interface Stage {
  name: string;
  box: Box2D[];
  polygon: Vec2D[][];
  platform: Vec2D[][];
  ground: Vec2D[][];
  ceiling: Vec2D[][];
  wallL: Vec2D[][];
  wallR: Vec2D[][];
  startingPoint: Vec2D[];
  startingFace: (1 | -1)[];
  respawnPoints: Vec2D[];
  respawnFace: (1 | -1)[];
  blastzone: Box2D;
  ledge: ['ground', number, number][];
  ledgePos: Vec2D[];
  scale: number;
  offset: Vec2D;
  connected?: any;
  movingPlats: number[];
  drawInit: (context: CanvasRenderingContext2D) => void;
  draw: (context: CanvasRenderingContext2D, frame: number) => void;
  movingPlatforms?: () => void;
  randall?: {
    path: Vec2D[];
    start: Vec2D;
    width: number; //5.95 * 2
    speed: number;
    // -0.354859
    left_edge: number;
    right_edge: number;
    top_edge: number;
    bottom_edge: number;

    path_offset: number;

    total_distance: number;
    segments: {
      start: Vec2D;
      end: Vec2D;
      dist: Vec2D;
      start_fraction: number;
      end_fraction: number;
      total_fraction: number;
    }[];
  };
  total_distance?: number;
}
