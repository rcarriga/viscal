import { VisualState } from "./types"
import { SET_COLOR, SET_SELECTED, SET_HIGHLIGHTED, VisualAction } from "./actions"

export const initialVisualState = {
  colors: {}
}

export const visual = (state = initialVisualState, action: VisualAction): VisualState => {
  switch (action.type) {
    case SET_COLOR:
      return {
        ...state,
        colors: {
          ...state.colors,
          [action.variableName]: action.variableName
        }
      }
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
