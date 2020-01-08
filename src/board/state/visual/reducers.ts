import { SET_SELECTED, SET_HIGHLIGHTED, VisualAction } from "./actions"
import { VisualState } from "./types"

export const initialVisualState = {
  colors: {},
  theme: {
    selectedStroke: "#3E3D32",
    stroke: "grey"
  }
}

export const visual = (state = initialVisualState, action: VisualAction): VisualState => {
  switch (action.type) {
    case SET_SELECTED:
      return {
        ...state,
        selected: action.nodeID
      }
    case SET_HIGHLIGHTED:
      return {
        ...state,
        highlighted: action.variableName
      }
    default:
      return state
  }
}
