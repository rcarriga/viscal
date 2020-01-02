import { CoordsAction, ADD_CHILD, SET_COORDS } from "./types"

export function addPaddedChild(
  parentID: string,
  childHeight: number,
  childWidth: number,
  widthPadding: number,
  heightPadding: number
): CoordsAction {
  return {
    type: ADD_CHILD,
    exprID: parentID,
    childHeight: childHeight,
    childWidth: childWidth,
    widthPadding: widthPadding,
    heightPadding: heightPadding
  }
}

export function setCoords(exprID: string, x: number, y: number): CoordsAction {
  return {
    type: SET_COORDS,
    exprID: exprID,
    x: x,
    y: y
  }
}
