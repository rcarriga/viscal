import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { useDispatch as _useDispatch } from "react-redux"
import { StateWithHistory } from "redux-undo"
import board from "./reducers"
import { TreeState, initialTreeState } from "./tree"
export * from "./tree"
export * from "./visual"
export * from "./types"
export * from "./hooks"
export * from "./selectors"
export * from "./actions"

const store = configureStore({
  reducer: board,
  preloadedState: {
    tree: (initialTreeState as unknown) as StateWithHistory<TreeState>
  },
  middleware: getDefaultMiddleware({ serializableCheck: false })
})

export default store

export type Dispatcher = typeof store.dispatch

export const useDispatch: () => Dispatcher = _useDispatch
