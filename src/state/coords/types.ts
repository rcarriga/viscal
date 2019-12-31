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
export const DUMMY = "DUMMY"

interface AddChildAction {
  type: typeof ADD_CHILD
  parentID: string
  childHeight: number
  childWidth: number
  widthBuffer: number
  heightBuffer: number
}

interface DummyAction {
  type: typeof DUMMY
}

export type CoordsAction = AddChildAction | DummyAction
