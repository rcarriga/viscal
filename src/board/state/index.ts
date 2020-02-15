import { createStore } from "redux"

import { board } from "./reducers"
export * from "./tree"
export * from "./visual"
export * from "./types"
export * from "./hooks"
export * from "./selectors"
export * from "./actions"

export default createStore(
  board,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
