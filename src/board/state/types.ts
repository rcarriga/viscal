import { TreeState } from "./tree/types"
import { VisualState } from "./visual/types"

export interface BoardState {
  tree: TreeState
  visual: VisualState
}
