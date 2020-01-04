import { DrawState } from "./types"
import {
  DrawAction,
  SET_RADIUS,
  SET_STROKE_WIDTH,
  SET_HEIGHT_MARGIN,
  SET_WIDTH_MARGIN,
  SET_START_X,
  SET_START_Y
} from "./actions"

export const initialDrawState: DrawState = {
  circleRadius: 30,
  heightMargin: 20,
  widthMargin: 20,
  strokeWidth: 4,
  startX: 50,
  startY: 50
}

export function draw(state = initialDrawState, action: DrawAction): DrawState {
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
    default:
      return state
  }
}
