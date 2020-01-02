// import _ from "lodash"
import { CoordsState, Coord, CoordsAction, ADD_CHILD, SET_COORDS } from "./types"

const initialCoord: Coord = { x: 0, y: 0, h: 0, w: 0 }
const initialState: CoordsState = {}

export function coordsReducer(state = initialState, action: CoordsAction): CoordsState {
  const expr = state[action.exprID] || initialCoord

  switch (action.type) {
    case ADD_CHILD:
      return {
        ...state,
        [action.exprID]: {
          ...expr,
          h: expr.h + action.childHeight,
          w: expr.w + action.childWidth
        }
      }

    case SET_COORDS:
      return {
        ...state,
        [action.exprID]: {
          ...expr,
          x: action.x,
          y: action.y
        }
      }

    default:
      return state
  }
}
