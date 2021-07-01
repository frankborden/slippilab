export declare type CharacterColor = string;
export interface CharacterInfo {
    id: number;
    name: string;
    shortName: string;
    colors: CharacterColor[];
}
export declare const UnknownCharacter: CharacterInfo;
export declare function getAllCharacters(): CharacterInfo[];
export declare function getCharacterInfo(externalCharacterId: number): CharacterInfo;
export declare function getCharacterShortName(externalCharacterId: number): string;
export declare function getCharacterName(externalCharacterId: number): string;
export declare function getCharacterColorName(externalCharacterId: number, characterColor: number): CharacterColor;
