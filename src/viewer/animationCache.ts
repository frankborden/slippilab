import { unzipSync, strFromU8 } from "fflate";

export type AnimationFrames = string[];
export interface CharacterAnimations {
  [animationName: string]: AnimationFrames;
}

const animationsCache = new Map<number, CharacterAnimations>();

export const fetchAnimations = async (
  externalCharacterId: number
): Promise<CharacterAnimations> => {
  if (animationsCache.has(externalCharacterId)) {
    return animationsCache.get(externalCharacterId) as CharacterAnimations;
  }
  const animations = await load(
    characterZipUrlByExternalId[externalCharacterId]
  );
  animationsCache.set(externalCharacterId, animations);
  return animations;
};

// zips expected to exist at the root
const characterZipUrlByExternalId = [
  "/zips/captainFalcon.zip",
  "/zips/donkeyKong.zip",
  "/zips/fox.zip",
  "/zips/mrGameAndWatch.zip",
  "/zips/kirby.zip",
  "/zips/bowser.zip",
  "/zips/link.zip",
  "/zips/luigi.zip",
  "/zips/mario.zip",
  "/zips/marth.zip",
  "/zips/mewtwo.zip",
  "/zips/ness.zip",
  "/zips/peach.zip",
  "/zips/pikachu.zip",
  "/zips/iceClimbers.zip",
  "/zips/jigglypuff.zip",
  "/zips/samus.zip",
  "/zips/yoshi.zip",
  "/zips/zelda.zip",
  "/zips/sheik.zip",
  "/zips/falco.zip",
  "/zips/youngLink.zip",
  "/zips/doctorMario.zip",
  "/zips/roy.zip",
  "/zips/pichu.zip",
  "/zips/ganondorf.zip",
];

async function load(url: string): Promise<CharacterAnimations> {
  const response = await fetch(url);
  const animationsZip = await response.blob();
  const fileBuffers = unzipSync(
    new Uint8Array(await animationsZip.arrayBuffer())
  );
  return Object.fromEntries(
    Object.entries(fileBuffers).map(([name, buffer]) => [
      name.replace(".json", ""),
      JSON.parse(strFromU8(buffer)),
    ])
  );
}
