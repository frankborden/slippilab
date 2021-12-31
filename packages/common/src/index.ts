import type { Replay as ReplayData } from '@slippilab/parser';

export interface Highlight {
  startFrame: number;
  endFrame: number;
}

export interface Replay {
  fileName: string;
  game: ReplayData;
  highlights: Highlight[];
}
