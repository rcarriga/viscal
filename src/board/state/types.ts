import { StateWithHistory } from "redux-undo"
import { TreeState } from "./tree/types"
import { VisualState } from "./visual/types"

export interface BoardState {
  tree: StateWithHistory<TreeState>
  visual: VisualState
}
