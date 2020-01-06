import { TreeState } from "./tree/types"
import { ControlState } from "./control/types"

export interface BoardState {
  tree: TreeState
  control: ControlState
}
