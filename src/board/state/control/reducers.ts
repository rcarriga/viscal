import { ControlState } from "./types"
import { BoardAction } from "../actions"
import {
  SET_EXPRESSION,
  SET_HEIGHT_MARGIN,
  SET_RADIUS,
  SET_START_X,
  SET_START_Y,
  SET_STROKE_WIDTH,
  SET_WIDTH_MARGIN
} from "./actions"

export const initialControlState: ControlState = {
  circleRadius: 30,
  expression: "",
  heightMargin: 20,
  startX: 50,
  startY: 100,
  strokeWidth: 4,
  widthMargin: 20
}

export function control(state = initialControlState, action: BoardAction): ControlState {
  switch (action.type) {
    case SET_RADIUS:
      return { ...state, circleRadius: action.value }
    case SET_HEIGHT_MARGIN:
      return { ...state, heightMargin: action.value }
    case SET_WIDTH_MARGIN:
      return { ...state, widthMargin: action.value }
    case SET_STROKE_WIDTH:
      return { ...state, strokeWidth: action.value }
    case SET_START_X:
      return { ...state, startX: action.value }
    case SET_START_Y:
      return { ...state, startY: action.value }
    case SET_EXPRESSION:
      return { ...state, expression: action.value }
    default:
      return state
  }
}
