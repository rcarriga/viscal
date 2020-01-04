export const SET_RADIUS = "CHANGE_RADIUS"
export const SET_HEIGHT_MARGIN = "CHANGE_HEIGHT_MARGIN"
export const SET_WIDTH_MARGIN = "CHANGE_WIDTH_MARGIN"
export const SET_STROKE_WIDTH = "CHANGE_STROKE_WIDTH"
export const SET_START_X = "CHANGE_START_X"
export const SET_START_Y = "CHANGE_START_Y"

export interface DrawState {
  circleRadius: number
  heightMargin: number
  widthMargin: number
  strokeWidth: number
  startX: number
  startY: number
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
