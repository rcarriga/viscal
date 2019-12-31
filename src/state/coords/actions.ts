import { CoordsAction, ADD_CHILD } from "./types"

export function addChild(
  parentID: string,
  childHeight: number,
  childWidth: number,
  widthBuffer: number,
  heightBuffer: number
): CoordsAction {
  return {
    type: ADD_CHILD,
    parentID: parentID,
    childHeight: childHeight,
    childWidth: childWidth,
    widthBuffer: widthBuffer,
    heightBuffer: heightBuffer
  }
}
