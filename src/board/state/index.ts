import { createStore } from "redux"
import { StateWithHistory } from "redux-undo"
import board from "./reducers"
import { TreeState, initialTreeState } from "./tree"
export * from "./tree"
export * from "./visual"
export * from "./types"
export * from "./hooks"
export * from "./selectors"
export * from "./actions"

export default createStore(
  board,
  {
    tree: (initialTreeState as unknown) as StateWithHistory<TreeState>
  },
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
