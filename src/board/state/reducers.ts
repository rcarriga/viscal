import { BoardState } from "./types"
import { BoardAction } from "./actions"
import { initialTreeState, tree } from "./tree/reducers"
import { initialControlState, control } from "./control/reducers"

const initialState = {
  control: initialControlState,
  coords: {},
  tree: initialTreeState
}

export function board(state = initialState, action: BoardAction): BoardState {
  const newTree = tree(state.tree, action)
  const newcontrol = control(state.control, action)
  return {
    control: newcontrol,
    tree: newTree
  }
}
