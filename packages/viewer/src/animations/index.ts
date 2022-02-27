import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';

export { isOneIndexed } from './oneIndexed';

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

// zips expected to exist at the root
export const characterZipUrlById = [
  `/zips/captainFalcon.zip`,
  `/zips/donkeyKong.zip`,
  `/zips/fox.zip`,
  `/zips/mrGameAndWatch.zip`,
  `/zips/kirby.zip`,
  `/zips/bowser.zip`,
  `/zips/link.zip`,
  `/zips/luigi.zip`,
  `/zips/mario.zip`,
  `/zips/marth.zip`,
  `/zips/mewtwo.zip`,
  `/zips/ness.zip`,
  `/zips/peach.zip`,
  `/zips/pikachu.zip`,
  `/zips/iceClimbers.zip`,
  `/zips/jigglypuff.zip`,
  `/zips/samus.zip`,
  `/zips/yoshi.zip`,
  `/zips/zelda.zip`,
  `/zips/sheik.zip`,
  `/zips/falco.zip`,
  `/zips/youngLink.zip`,
  `/zips/doctorMario.zip`,
  `/zips/roy.zip`,
  `/zips/pichu.zip`,
  `/zips/ganondorf.zip`,
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
