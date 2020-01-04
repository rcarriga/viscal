import { TreeState, TreeAction } from "./tree/types"
import { DrawState, DrawAction } from "./draw/types"

export interface Coord {
  readonly x: number
  readonly y: number
  readonly h: number
  readonly w: number
}

export type Coords = { [nodeID: string]: Coord }

export interface BoardState {
  coords: Coords
  tree: TreeState
  draw: DrawState
}

export type BoardAction = TreeAction | DrawAction
