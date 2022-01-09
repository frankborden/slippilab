import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';

export { isOneIndexed } from './oneIndexed';
export { animationNameByActionId } from './actions';

const animationsCache = new Map<number, CharacterAnimations>();

export type AnimationFrames = string[];
export type CharacterAnimations = { [animationName: string]: AnimationFrames };

export const fetchAnimations = async (
  charId: number,
): Promise<CharacterAnimations> => {
  if (animationsCache.has(charId)) {
    return animationsCache.get(charId)!;
  }
  const animations = await load(characterZipUrlById[charId]);
  animationsCache.set(charId, animations);
  return animations;
};

const base = import.meta.env.BASE_URL;

export const characterZipUrlById = [
  `${base}zips/captainFalcon.zip`,
  `${base}zips/donkeyKong.zip`,
  `${base}zips/fox.zip`,
  `${base}zips/mrGameAndWatch.zip`,
  `${base}zips/kirby.zip`,
  `${base}zips/bowser.zip`,
  `${base}zips/link.zip`,
  `${base}zips/luigi.zip`,
  `${base}zips/mario.zip`,
  `${base}zips/marth.zip`,
  `${base}zips/mewtwo.zip`,
  `${base}zips/ness.zip`,
  `${base}zips/peach.zip`,
  `${base}zips/pikachu.zip`,
  `${base}zips/iceClimbers.zip`,
  `${base}zips/jigglypuff.zip`,
  `${base}zips/samus.zip`,
  `${base}zips/yoshi.zip`,
  `${base}zips/zelda.zip`,
  `${base}zips/sheik.zip`,
  `${base}zips/falco.zip`,
  `${base}zips/youngLink.zip`,
  `${base}zips/doctorMario.zip`,
  `${base}zips/roy.zip`,
  `${base}zips/pichu.zip`,
  `${base}zips/ganondorf.zip`,
];

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
