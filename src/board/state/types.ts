import { TreeState } from "./tree/types"
import { ControlState } from "./control/types"
import { VisualState } from "./visual/types"

export interface BoardState {
  tree: TreeState
  control: ControlState
  visual: VisualState
}
