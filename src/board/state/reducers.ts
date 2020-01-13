import { combineReducers } from "redux"
import { tree } from "./tree/reducers"
import { visual } from "./visual/reducers"

export const board = combineReducers({ tree, visual })
