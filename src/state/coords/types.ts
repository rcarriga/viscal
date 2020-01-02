export interface Coord {
  x: number
  y: number
  h: number
  w: number
}

export interface CoordsState {
  [nodeId: string]: Coord
}

export const ADD_CHILD = "ADD_CHILD"
export const SET_COORDS = "DUMMY"

interface AddChildAction {
  type: typeof ADD_CHILD
  exprID: string
  childHeight: number
  childWidth: number
  widthPadding: number
  heightPadding: number
}

interface SetCoordsAction {
  type: typeof SET_COORDS
  exprID: string
  x: number
  y: number
}

export type CoordsAction = AddChildAction | SetCoordsAction
