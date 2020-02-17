import { VisualAction } from "./actions"
import { VisualState, initialVisualState } from "./types"

export const visual = (state = initialVisualState, action: VisualAction): VisualState => {
  switch (action.type) {
    case "SET_SELECTED":
      return {
        ...state,
        selected: action.nodeID
      }
    case "SET_HIGHLIGHTED":
      return {
        ...state,
        highlighted: action.variableName
      }
    case "SET_EVENT":
      return {
        ...state,
        events: {
          ...state.events,
          [action.event]: action.handler
        }
      }
    case "SET_TREE_LAYOUT":
      return {
        ...state,
        treeLayout: {
          ...state.treeLayout,
          [action.parameter]: action.value
        }
      }
    case "ADJUST_TREE_LAYOUT":
      return {
        ...state,
        treeLayout: {
          ...state.treeLayout,
          [action.parameter]: state.treeLayout[action.parameter] + action.value
        }
      }
    case "SET_NODE_DIMENSION":
      return {
        ...state,
        dimensions: {
          ...state.dimensions,
          [action.dimension]: action.value
        }
      }
    case "SET_MOVING":
      return {
        ...state,
        animation: {
          ...state.animation,
          moving: add(action.nodeID, state.animation.moving)
        }
      }
    case "SET_STOPPED":
      return {
        ...state,
        animation: {
          ...state.animation,
          moving: remove(action.nodeID, state.animation.moving)
        }
      }
    case "SET_EXPRESSION":
      return {
        ...state,
        expression: action.expr
      }
    default:
      return state
  }
}

const remove = <A>(elem: A, set: Set<A>): Set<A> => {
  const newSet = new Set(set)
  newSet.delete(elem)
  return newSet
}

const add = <A>(elem: A, set: Set<A>): Set<A> => {
  const newSet = new Set(set)
  newSet.add(elem)
  return newSet
}
