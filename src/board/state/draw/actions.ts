export const SET_RADIUS = "CHANGE_RADIUS"
export const SET_HEIGHT_MARGIN = "CHANGE_HEIGHT_MARGIN"
export const SET_WIDTH_MARGIN = "CHANGE_WIDTH_MARGIN"
export const SET_STROKE_WIDTH = "CHANGE_STROKE_WIDTH"
export const SET_START_X = "CHANGE_START_X"
export const SET_START_Y = "CHANGE_START_Y"

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

interface SetRadiusAction {
  type: typeof SET_RADIUS
  value: number
}

interface SetHeightMarginAction {
  type: typeof SET_HEIGHT_MARGIN
  value: number
}

interface SetWidthMarginAction {
  type: typeof SET_WIDTH_MARGIN
  value: number
}

interface SetStrokeWidthAction {
  type: typeof SET_STROKE_WIDTH
  value: number
}

interface SetStartX {
  type: typeof SET_START_X
  value: number
}

interface SetStartY {
  type: typeof SET_START_Y
  value: number
}

export type DrawAction =
  | SetRadiusAction
  | SetHeightMarginAction
  | SetWidthMarginAction
  | SetStrokeWidthAction
  | SetStartX
  | SetStartY
