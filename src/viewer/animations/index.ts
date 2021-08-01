import { characterNamesById } from '../common';
export { isOneIndexed } from './oneIndexed';
export { animationNameByActionId } from './actions';

const animationsCache = new Map<number, any>();

export type AnimationFrames = string[];
export type CharacterAnimations = { [actionName: string]: AnimationFrames };

export const fetchAnimations = async (
  charId: number,
): Promise<CharacterAnimations> => {
  if (animationsCache.has(charId)) {
    return animationsCache.get(charId);
  }
  const animations = importAnimation(charId);
  animationsCache.set(charId, animations);
  return animations;
};

const importAnimation = async (
  charId: number,
): Promise<CharacterAnimations> => {
  switch (characterNamesById[charId]) {
    case 'Sheik':
      return (await import('./sheik')).default;
    case 'Peach':
      return (await import('./peach')).default;
    case 'Fox':
      return (await import('./fox')).default;
    case 'Falco':
      return (await import('./falco')).default;
    case 'Captain Falcon':
      return (await import('./falcon')).default;
    case 'Marth':
      return (await import('./marth')).default;
    case 'Jigglypuff':
      return (await import('./jigglypuff')).default;
    default:
      throw new Error(`Unsupported character id: ${charId}`);
  }
};
