import randomcolor from "randomcolor"
import { VisualState, VarColors, VarName } from "./types"
import { NEW_COLOR, SET_COLOR, SET_SELECTED, SET_HIGHLIGHTED, VisualAction } from "./actions"

export const initialVisualState = {
  colors: {},
  theme: {
    selectedStroke: "green"
  }
}

export const visual = (state = initialVisualState, action: VisualAction): VisualState => {
  switch (action.type) {
    case NEW_COLOR:
      return {
        ...state,
        colors: addColor(action.variableName, state.colors)
      }
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

const addColor = (varName: VarName, colors: VarColors): VarColors => {
  return {
    ...colors,
    [varName]: randomcolor({ luminosity: "bright" })
  }
}
