import { VisualAction } from "./actions"
import { VisualState } from "./types"

export const initialVisualState: VisualState = {
  expression: "",
  theme: {
    highlightedStroke: "#A9FF68",
    selectedStroke: "#3E3D32",
    stroke: "grey"
  },
  events: {},
  dimensions: {
    circleRadius: 30,
    heightMargin: 20,
    strokeWidth: 4,
    widthMargin: 20
  },
  treeLayout: {
    startX: 50,
    startY: 100
  }
}

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
    case "SET_NODE_DIMENSION":
      return {
        ...state,
        dimensions: {
          ...state.dimensions,
          [action.dimension]: action.value
        }
      }
    default:
      return state
  }
}
