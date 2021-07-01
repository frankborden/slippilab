import { characters } from '../characters/character';

// Store all the imported animations here
const animationMap = new Map<number, any>();

const importAnimation = async (
  charId: number,
): Promise<RawCharacterAnimations> => {
  switch (characters[charId]) {
    case 'Captain Falcon': {
      // @ts-ignore
      return (await import('./falcon')).default;
    }
    case 'Fox': {
      // @ts-ignore
      return (await import('./fox')).default;
    }
    case 'Marth': {
      // @ts-ignore
      return (await import('./marth')).default;
    }
    case 'Jigglypuff': {
      // @ts-ignore
      return (await import('./puff')).default;
    }
    case 'Falco': {
      // @ts-ignore
      return (await import('./falco')).default;
    }
    default: {
      throw new Error(`Unsupported character id: ${charId}`);
    }
  }
};

export type RawCharacterAnimations = { [actionName: string]: number[][][] };
export type CharacterAnimations = { [actionName: string]: Int16Array[][] };

export const fetchAnimation = async (
  charId: number,
): Promise<CharacterAnimations> => {
  if (animationMap.has(charId)) {
    return animationMap.get(charId);
  }

  const charAnimations = await importAnimation(charId);
  const converted: CharacterAnimations = {};
  Object.entries(charAnimations).forEach(([actionName, actionData]) => {
    converted[actionName] = actionData.map((innerData) => {
      return [new Int16Array(innerData[0])];
    });
  });

  // Store it for later
  animationMap.set(charId, converted);
  return converted;
};
