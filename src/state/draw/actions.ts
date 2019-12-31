import { DrawAction, CHANGE_RADIUS, CHANGE_STROKE_WIDTH, CHANGE_HEIGHT_MARGIN, CHANGE_WIDTH_MARGIN } from "./types"

export function changeRadius(value: number): DrawAction {
  return { type: CHANGE_RADIUS, value: value }
}

export function changeHeightMargin(value: number): DrawAction {
  return { type: CHANGE_HEIGHT_MARGIN, value: value }
}

export function changeWidthMargin(value: number): DrawAction {
  return { type: CHANGE_WIDTH_MARGIN, value: value }
}

export function changeStrokeWidth(value: number): DrawAction {
  return { type: CHANGE_STROKE_WIDTH, value: value }
}
