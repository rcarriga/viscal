import { SET_SELECTED, SET_HIGHLIGHTED, SET_EVENT, VisualAction } from "./actions"
import { VisualState } from "./types"

export const initialVisualState = {
  colors: {},
  theme: {
    selectedStroke: "#3E3D32",
    stroke: "grey"
  },
  events: {}
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
    case SET_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          [action.eventName]: action.handler
        }
      }
    default:
      return state
  }
}
