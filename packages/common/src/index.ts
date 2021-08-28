import type { Game } from '@slippilab/parser';

export interface Highlight {
  startFrame: number;
  endFrame: number;
}

export interface Replay {
  fileName: string;
  game: Game;
  highlights: Highlight[];
}
