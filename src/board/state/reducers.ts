import { tree } from "./tree/reducers"
import { control } from "./control/reducers"
import { visual } from "./visual/reducers"
import { combineReducers } from "redux"

export const board = combineReducers({ control, tree, visual })
