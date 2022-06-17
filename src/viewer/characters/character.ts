import { ActionName } from "~/common/ids";

export interface Character {
  scale: number;
  shieldOffset: [number, number];
  // Model Size * Shield Size attributes
  shieldSize: number;
  animationMap: Map<ActionName, string>;
  specialsMap: Map<number, string>;
}
