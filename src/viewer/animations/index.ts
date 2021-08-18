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
  const animations = await importAnimation(charId);
  animationsCache.set(charId, animations);
  return animations;
};

const importAnimation = async (
  charId: number,
): Promise<CharacterAnimations> => {
  switch (characterNamesById[charId]) {
    case 'Sheik':
      const sheik = await import('./sheik');
      await sheik.init();
      return sheik.animations;
    case 'Peach':
      const peach = await import('./peach');
      await peach.init();
      return peach.animations;
    case 'Fox':
      const fox = await import('./fox');
      await fox.init();
      return fox.animations;
    case 'Falco':
      const falco = await import('./falco');
      await falco.init();
      return falco.animations;
    case 'Captain Falcon':
      const falcon = await import('./falcon');
      await falcon.init();
      return falcon.animations;
    case 'Marth':
      const marth = await import('./marth');
      await marth.init();
      return marth.animations;
    case 'Jigglypuff':
      const jigglypuff = await import('./jigglypuff');
      await jigglypuff.init();
      return jigglypuff.animations;
    case 'Pikachu':
      const pikachu = await import('./pikachu');
      await pikachu.init();
      return pikachu.animations;
    default:
      throw new Error(`Unsupported character id: ${charId}`);
  }
};
