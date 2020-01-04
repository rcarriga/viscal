import {
  TreeState,
  TreeAction,
  TreeNode,
  NodeID,
  NORMAL_ORDER_REDUCTION,
  ADD_VARIABLE,
  ADD_ABSTRACTION,
  ADD_APPLICATION,
  VARIABLE,
  ABSTRACTION,
  APPLICATION
} from "./types"

export const initialTreeState: TreeState = { nodes: {} }

export function tree(state = initialTreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case ADD_VARIABLE:
      return addNode(state, action.expressionID, {
        parentID: action.parentID,
        expr: { type: VARIABLE, index: action.index, name: action.name, children: [] }
      })
    case ADD_ABSTRACTION:
      return addNode(state, action.expressionID, {
        parentID: action.parentID,
        expr: {
          type: ABSTRACTION,
          variableName: action.variableName,
          children: action.child ? [action.child] : []
        }
      })
    case ADD_APPLICATION:
      return addNode(state, action.expressionID, {
        parentID: action.parentID,
        expr: {
          type: APPLICATION,
          left: action.left,
          right: action.right,
          children: [action.left, action.right]
        }
      })
    case NORMAL_ORDER_REDUCTION:
      console.log("TREE REDUCTION NOT IMPLEMENTED :(")
      return state
    default:
      return state
  }
}

function addNode(state: TreeState, nodeID: NodeID, expr: TreeNode): TreeState {
  return {
    ...state,
    nodes: {
      [nodeID]: expr
    }
  }
}