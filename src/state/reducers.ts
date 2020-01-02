import { drawReducer } from "./draw/reducers"
import { coordsReducer } from "./coords/reducers"
import { treeReducer } from "./tree/reducers"
import { combineReducers } from "redux"

export default combineReducers({
  tree: treeReducer,
  coords: coordsReducer,
  draw: drawReducer
})
