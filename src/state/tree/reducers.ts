import { TreeState, TreeAction, NORMAL_ORDER_REDUCTION, SET_TREE } from "./types"

const initialState: TreeState = { nodes: {} }

export function normalOrderReducer(state = initialState, action: TreeAction): TreeState {
  switch (action.type) {
    case SET_TREE:
      return action.tree
    case NORMAL_ORDER_REDUCTION:
      console.log("TREE REDUCTION NOT IMPLEMENTED :(")
      return state
    default:
      return state
  }
}
