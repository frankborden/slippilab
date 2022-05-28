import { ActionName } from '../../common/ids'

export interface Character {
  scale: number
  shieldOffset: [number, number]
  shieldSize: number // Model Size * Shield Size attributes
  animationMap: Map<ActionName, string>
  specialsMap: Map<number, string>
}
