import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';

// @ts-ignore
import foxAnimationsUrl from './zips/fox.zip?url';
// @ts-ignore
import falcoAnimationsUrl from './zips/falco.zip?url';
// @ts-ignore
import falconAnimationsUrl from './zips/falcon.zip?url';
// @ts-ignore
import jigglypuffAnimationsUrl from './zips/jigglypuff.zip?url';
// @ts-ignore
import marthAnimationsUrl from './zips/marth.zip?url';
// @ts-ignore
import peachAnimationsUrl from './zips/peach.zip?url';
// @ts-ignore
import pikachuAnimationsUrl from './zips/pikachu.zip?url';
// @ts-ignore
import sheikAnimationsUrl from './zips/sheik.zip?url';
import { characterNamesById } from '../common';
export { isOneIndexed } from './oneIndexed';
export { animationNameByActionId } from './actions';

const animationsCache = new Map<number, CharacterAnimations>();

export type AnimationFrames = string[];
export type CharacterAnimations = { [actionName: string]: AnimationFrames };

export const fetchAnimations = async (
  charId: number,
): Promise<CharacterAnimations> => {
  if (animationsCache.has(charId)) {
    return animationsCache.get(charId)!;
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
      return load(sheikAnimationsUrl);
    case 'Peach':
      return load(peachAnimationsUrl);
    case 'Fox':
      return load(foxAnimationsUrl);
    case 'Falco':
      return load(falcoAnimationsUrl);
    case 'Captain Falcon':
      return load(falconAnimationsUrl);
    case 'Marth':
      return load(marthAnimationsUrl);
    case 'Jigglypuff':
      return load(jigglypuffAnimationsUrl);
    case 'Pikachu':
      return load(pikachuAnimationsUrl);
    default:
      throw new Error(`Unsupported character id: ${charId}`);
  }
};

const load = async (url: string): Promise<CharacterAnimations> => {
  const animations: CharacterAnimations = {};
  const response = await fetch(url);
  const animationsZip = await response.blob();
  const reader = new ZipReader(new BlobReader(animationsZip));
  const files = await reader.getEntries();
  await Promise.all(
    files.map(async (file) => {
      const animationName = file.filename.replace('.json', '');
      const contents = await file.getData?.(new TextWriter());
      const animationData = JSON.parse(contents);
      animations[animationName] = animationData;
    }),
  );
  return animations;
};
