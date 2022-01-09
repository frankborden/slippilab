import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';

// // @ts-ignore
// import bowserAnimationsUrl from './zips/bowser.zip';
// // @ts-ignore
// import captainFalconAnimationsUrl from './zips/captainFalcon.zip';
// // @ts-ignore
// import doctorMarioAnimationsUrl from './zips/doctorMario.zip';
// // @ts-ignore
// import donkeyKongAnimationsUrl from './zips/donkeyKong.zip';
// // @ts-ignore
// import falcoAnimationsUrl from './zips/falco.zip';
// // @ts-ignore
// import foxAnimationsUrl from './zips/fox.zip';
// // @ts-ignore
// import ganondorfAnimationsUrl from './zips/ganondorf.zip';
// // @ts-ignore
// import iceClimbersAnimationsUrl from './zips/iceClimbers.zip';
// // @ts-ignore
// import jigglypuffAnimationsUrl from './zips/jigglypuff.zip';
// // @ts-ignore
// import kirbyAnimationsUrl from './zips/kirby.zip';
// // @ts-ignore
// import linkAnimationsUrl from './zips/link.zip';
// // @ts-ignore
// import luigiAnimationsUrl from './zips/luigi.zip';
// // @ts-ignore
// import marioAnimationsUrl from './zips/mario.zip';
// // @ts-ignore
// import marthAnimationsUrl from './zips/marth.zip';
// // @ts-ignore
// import mewtwoAnimationsUrl from './zips/mewtwo.zip';
// // @ts-ignore
// import mrGameAndWatchAnimationsUrl from './zips/mrGameAndWatch.zip';
// // @ts-ignore
// import nessAnimationsUrl from './zips/ness.zip';
// // @ts-ignore
// import peachAnimationsUrl from './zips/peach.zip';
// // @ts-ignore
// import pichuAnimationsUrl from './zips/pichu.zip';
// // @ts-ignore
// import pikachuAnimationsUrl from './zips/pikachu.zip';
// // @ts-ignore
// import royAnimationsUrl from './zips/roy.zip';
// // @ts-ignore
// import samusAnimationsUrl from './zips/samus.zip';
// // @ts-ignore
// import sheikAnimationsUrl from './zips/sheik.zip';
// // @ts-ignore
// import yoshiAnimationsUrl from './zips/yoshi.zip';
// // @ts-ignore
// import youngLinkAnimationsUrl from './zips/youngLink.zip';
// // @ts-ignore
// import zeldaAnimationsUrl from './zips/zelda.zip';
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

// @ts-ignore
const base = import.meta.env.BASE_URL;
console.log(base);

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
  // captainFalconAnimationsUrl,
  // donkeyKongAnimationsUrl,
  // foxAnimationsUrl,
  // mrGameAndWatchAnimationsUrl,
  // kirbyAnimationsUrl,
  // bowserAnimationsUrl,
  // linkAnimationsUrl,
  // luigiAnimationsUrl,
  // marioAnimationsUrl,
  // marthAnimationsUrl,
  // mewtwoAnimationsUrl,
  // nessAnimationsUrl,
  // peachAnimationsUrl,
  // pikachuAnimationsUrl,
  // iceClimbersAnimationsUrl,
  // jigglypuffAnimationsUrl,
  // samusAnimationsUrl,
  // yoshiAnimationsUrl,
  // zeldaAnimationsUrl,
  // sheikAnimationsUrl,
  // falcoAnimationsUrl,
  // youngLinkAnimationsUrl,
  // doctorMarioAnimationsUrl,
  // royAnimationsUrl,
  // pichuAnimationsUrl,
  // ganondorfAnimationsUrl,
];

const load = async (url: string): Promise<CharacterAnimations> => {
  const animations: CharacterAnimations = {};
  console.log(url);
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
