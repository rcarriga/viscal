import { BoardAction } from "../actions"
import { TreeState, TreeNode, NodeID } from "./types"

export const initialTreeState: TreeState = { nodes: {} }

export const tree = (state = initialTreeState, action: BoardAction): TreeState => {
  switch (action.type) {
    case "SET_ROOT":
      return { ...state, root: action.nodeID }
    case "ADD_VARIABLE":
      return addNode(state, action.nodeID, {
        parentID: action.parentID,
        type: "VARIABLE",
        index: action.index,
        name: action.name,
        children: []
      })
    case "ADD_ABSTRACTION":
      return addNode(state, action.nodeID, {
        parentID: action.parentID,
        type: "ABSTRACTION",
        variableName: action.variableName,
        children: action.child ? [action.child] : []
      })
    case "ADD_APPLICATION":
      return addNode(state, action.nodeID, {
        parentID: action.parentID,
        type: "APPLICATION",
        left: action.left,
        right: action.right,
        children: [action.left, action.right]
      })
    case "NORMAL_ORDER_REDUCTION":
      console.log("TREE REDUCTION NOT IMPLEMENTED :(")
      return state
    default:
      return state
  }
}

const addNode = (state: TreeState, nodeID: NodeID, expr: TreeNode): TreeState => {
  return {
    ...state,
    nodes: {
      ...state.nodes,
      [nodeID]: expr
    }
  }
}
