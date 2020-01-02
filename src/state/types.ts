import { CoordsState } from "./coords/types"
import { TreeState } from "./tree/types"
import { DrawState } from "./draw/types"

export interface State {
  tree: TreeState
  coords: CoordsState
  draw: DrawState
}
