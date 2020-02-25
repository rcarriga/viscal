import { combineReducers } from "redux"
import undoable from "redux-undo"
import { tree } from "./tree/reducers"
import { visual } from "./visual/reducers"

const board = combineReducers({ tree: undoable(tree), visual })
export default board
