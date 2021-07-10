import { battlefield } from './battlefield';
import { finalDestination } from './finalDestination';
import { dreamland } from './dreamland';
import { yoshisStory } from './yoshisStory';
import { pokemonStadium } from './pokemonStadium';
import { fountain } from './fountain';
import type { Stage } from '../common';

export { createStageRender } from './render';
export const supportedStagesById: { [stageId: number]: Stage } = {
  2: fountain,
  3: pokemonStadium,
  8: yoshisStory,
  28: dreamland,
  31: battlefield,
  32: finalDestination,
};
