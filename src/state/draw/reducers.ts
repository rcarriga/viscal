import {
  DrawState,
  DrawAction,
  CHANGE_RADIUS,
  CHANGE_STROKE_WIDTH,
  CHANGE_HEIGHT_MARGIN,
  CHANGE_WIDTH_MARGIN
} from "./types"

const initialState: DrawState = {
  circleRadius: 30,
  heightMargin: 20,
  widthMargin: 20,
  strokeWidth: 4
}

export function drawReducer(state = initialState, action: DrawAction): DrawState {
  switch (action.type) {
    case CHANGE_RADIUS:
      return { ...state, circleRadius: action.value }
    case CHANGE_HEIGHT_MARGIN:
      return { ...state, heightMargin: action.value }
    case CHANGE_WIDTH_MARGIN:
      return { ...state, widthMargin: action.value }
    case CHANGE_STROKE_WIDTH:
      return { ...state, strokeWidth: action.value }
    default:
      return state
  }
}
