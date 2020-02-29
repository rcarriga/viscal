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
    case "SET_EXPRESSION":
      return {
        ...state,
        expression: action.expr
      }
    case "SET_MODE":
      return {
        ...state,
        animation: {
          ...state.animation,
          mode: action.mode
        }
      }
    case "SET_ANIMATION_SETTING":
      return {
        ...state,
        animation: {
          ...state.animation,
          settings: {
            ...state.animation.settings,
            [action.setting]: action.value
          }
        }
      }
    case "SET_ANIMATION_ENABLED":
      return {
        ...state,
        animation: {
          ...state.animation,
          enabled: action.value
        }
      }
    default:
      return state
  }
}
