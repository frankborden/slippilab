import { battlefield } from './battlefield';
import { finalDestination } from './finalDestination';
import type { Line, Vector } from '../common';
import { dreamland } from './dreamland';
import { yoshisStory } from './yoshisStory';
import { pokemonStadium } from './pokemonStadium';
import { fountain } from './fountain';

export interface Stage {
  lines: Line[];
  scale: number;
  offset: Vector;
  topRightBlastzone: Vector;
  bottomLeftBlastzone: Vector;
  getMovingPlatforms?: (frame: number) => Line[];
}

export const stagesById: { [stageId: number]: Stage } = {
  2: fountain,
  3: pokemonStadium,
  8: yoshisStory,
  28: dreamland,
  31: battlefield,
  32: finalDestination,
};
