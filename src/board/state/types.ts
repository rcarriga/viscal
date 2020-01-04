import { TreeState } from "./tree/types"
import { DrawState } from "./draw/types"

export interface Coord {
  readonly x: number
  readonly y: number
  readonly h: number
  readonly w: number
}

export type CoordState = { [nodeID: string]: Coord }

export interface BoardState {
  coords: CoordState
  tree: TreeState
  draw: DrawState
}
