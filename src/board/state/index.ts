import { createStore } from "redux"

import { board } from "./reducers"
export * from "./tree"
export * from "./visual"
export * from "./types"
export * from "./selectors"

export default createStore(board)
