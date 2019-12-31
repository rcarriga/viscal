import _ from "lodash"
import { CoordsState, Coord, CoordsAction, ADD_CHILD } from "./types"

const initialCoord: Coord = { x: 0, y: 0, h: 0, w: 0 }
const initialState: CoordsState = {}

export function coordsReducer(state = initialState, action: CoordsAction): CoordsState {
  switch (action.type) {
    case ADD_CHILD: {
      const node = _.clone(state[action.parentID] || initialCoord)
      node.h += action.childHeight
      node.w += action.childWidth
      return {
        ...state,
        [action.parentID]: node
      }
    }
    default:
      return state
  }
}
