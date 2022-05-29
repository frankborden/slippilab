import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js'

export type AnimationFrames = string[]
export interface CharacterAnimations {
  [animationName: string]: AnimationFrames
}

const animationsCache = new Map<number, CharacterAnimations>()

export const fetchAnimations = async (
  externalCharacterId: number
): Promise<CharacterAnimations> => {
  if (animationsCache.has(externalCharacterId)) {
    return animationsCache.get(externalCharacterId) as CharacterAnimations
  }
  const animations = await load(
    characterZipUrlByExternalId[externalCharacterId]
  )
  animationsCache.set(externalCharacterId, animations)
  return animations
}

// zips expected to exist at the root
const characterZipUrlByExternalId = [
  '/zips/captainFalcon.zip',
  '/zips/donkeyKong.zip',
  '/zips/fox.zip',
  '/zips/mrGameAndWatch.zip',
  '/zips/kirby.zip',
  '/zips/bowser.zip',
  '/zips/link.zip',
  '/zips/luigi.zip',
  '/zips/mario.zip',
  '/zips/marth.zip',
  '/zips/mewtwo.zip',
  '/zips/ness.zip',
  '/zips/peach.zip',
  '/zips/pikachu.zip',
  '/zips/iceClimbers.zip',
  '/zips/jigglypuff.zip',
  '/zips/samus.zip',
  '/zips/yoshi.zip',
  '/zips/zelda.zip',
  '/zips/sheik.zip',
  '/zips/falco.zip',
  '/zips/youngLink.zip',
  '/zips/doctorMario.zip',
  '/zips/roy.zip',
  '/zips/pichu.zip',
  '/zips/ganondorf.zip'
]

async function load (url: string): Promise<CharacterAnimations> {
  const animations: CharacterAnimations = {}
  const response = await fetch(url)
  const animationsZip = await response.blob()
  const reader = new ZipReader(new BlobReader(animationsZip))
  const files = await reader.getEntries()
  await Promise.all(
    files.map(async (file) => {
      const animationName = file.filename.replace('.json', '')
      const contents = await file.getData?.(new TextWriter())
      const animationData = JSON.parse(contents)
      animations[animationName] = animationData
    })
  )
  return animations
}
