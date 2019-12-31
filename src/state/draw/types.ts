export const CHANGE_RADIUS = "CHANGE_RADIUS"
export const CHANGE_HEIGHT_MARGIN = "CHANGE_HEIGHT_MARGIN"
export const CHANGE_WIDTH_MARGIN = "CHANGE_WIDTH_MARGIN"
export const CHANGE_STROKE_WIDTH = "CHANGE_STROKE_WIDTH"

export interface DrawState {
  circleRadius: number
  heightMargin: number
  widthMargin: number
  strokeWidth: number
}

interface ChangeRadiusAction {
  type: typeof CHANGE_RADIUS
  value: number
}

interface ChangeHeightMarginAction {
  type: typeof CHANGE_HEIGHT_MARGIN
  value: number
}

interface ChangeWidthMarginAction {
  type: typeof CHANGE_WIDTH_MARGIN
  value: number
}

interface ChangeStrokeWidthAction {
  type: typeof CHANGE_STROKE_WIDTH
  value: number
}

export type DrawAction =
  | ChangeRadiusAction
  | ChangeHeightMarginAction
  | ChangeWidthMarginAction
  | ChangeStrokeWidthAction
