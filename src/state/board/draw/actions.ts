import {
  DrawAction,
  SET_RADIUS,
  SET_STROKE_WIDTH,
  SET_HEIGHT_MARGIN,
  SET_WIDTH_MARGIN,
  SET_START_X,
  SET_START_Y
} from "./types"

export function setRadius(value: number): DrawAction {
  return { type: SET_RADIUS, value: value }
}

export function setHeightMargin(value: number): DrawAction {
  return { type: SET_HEIGHT_MARGIN, value: value }
}

export function setWidthMargin(value: number): DrawAction {
  return { type: SET_WIDTH_MARGIN, value: value }
}

export function setStrokeWidth(value: number): DrawAction {
  return { type: SET_STROKE_WIDTH, value: value }
}

export function setStartX(value: number): DrawAction {
  return { type: SET_START_X, value: value }
}

export function setStartY(value: number): DrawAction {
  return { type: SET_START_Y, value: value }
}
