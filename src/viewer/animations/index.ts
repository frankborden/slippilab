import { characterNamesById } from '../common';
export { isOneIndexed } from './oneIndexed';
export { actions, specials } from './actions';
// Adapted directly from https://github.com/vinceau/react-slp-viewer

// Store all the imported animations here
const loadedAnimationsByCharacterId = new Map<number, any>();

export type AnimationFrames = AnimationFrame[];
export type AnimationFrame = Int16Array;
export type RawCharacterAnimations = { [actionName: string]: number[][][] };
export type CharacterAnimations = { [actionName: string]: AnimationFrames };

export const fetchAnimation = async (
  charId: number,
): Promise<CharacterAnimations> => {
  if (loadedAnimationsByCharacterId.has(charId)) {
    return loadedAnimationsByCharacterId.get(charId);
  }

  const rawAnimations = await importRawAnimation(charId);
  const animations: CharacterAnimations = {};
  Object.entries(rawAnimations).forEach(([name, data]) => {
    animations[name] = data.map((frame) => {
      return new Int16Array(frame[0]);
    });
  });

  // Store it for later
  loadedAnimationsByCharacterId.set(charId, animations);
  return animations;
};

const importRawAnimation = async (
  charId: number,
): Promise<RawCharacterAnimations> => {
  switch (characterNamesById[charId]) {
    case 'Captain Falcon': {
      return (await import('./falcon')).default;
    }
    case 'Fox': {
      return (await import('./fox')).default;
    }
    case 'Marth': {
      return (await import('./marth')).default;
    }
    case 'Jigglypuff': {
      return (await import('./puff')).default;
    }
    case 'Falco': {
      return (await import('./falco')).default;
    }
    default: {
      throw new Error(`Unsupported character id: ${charId}`);
    }
  }
};
