import { configureStore } from "@reduxjs/toolkit"
import { useDispatch as _useDispatch } from "react-redux"
import undoable, { includeAction } from "redux-undo"
import treeSlice from "./tree/reducers"
import visualSlice from "./visual/reducers"
export * from "./tree"
export * from "./visual"
export * from "./hooks"
export * from "./selectors"

type TreeAction = keyof typeof treeSlice.actions

const include = (actions: TreeAction[]) => includeAction(actions.map(action => `tree/${action}`))

const store = configureStore({
  reducer: {
    tree: undoable(treeSlice.reducer, {
      ignoreInitialState: true,
      filter: include(["setRoot", "queueReduction", "nextReductionStage"])
    }),
    visual: visualSlice.reducer
  }
})

export type BoardState = ReturnType<typeof store.getState>

export default store

export type Dispatcher = typeof store.dispatch

export const useDispatch: () => Dispatcher = _useDispatch
