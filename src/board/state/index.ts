import { configureStore } from "@reduxjs/toolkit"
import { TreeState } from "board/state/tree"
import { useDispatch as _useDispatch } from "react-redux"
import undoable, { includeAction, StateWithHistory } from "redux-undo"
import treeSlice from "./tree/reducers"
import visualSlice from "./visual/reducers"
export * from "./tree"
export * from "./visual"
export * from "./hooks"
export * from "./selectors"

type TreeAction = keyof typeof treeSlice.actions

const include = (actions: TreeAction[]) => includeAction(actions.map(action => `tree/${action}`))

const groupFunction = (_: TreeAction, currentState: TreeState, stateHistory: StateWithHistory<TreeState>) => {
  const reduction = currentState.reduction || stateHistory.present.reduction
  if (reduction && Object.keys(reduction.substitutions).length === 0)
    switch (reduction.type) {
      case "FADE":
      case "REMOVE":
        return "NO_EFFECT"
      default:
    }
  return null
}

const store = configureStore({
  reducer: {
    tree: undoable(treeSlice.reducer, {
      filter: include(["setRoot", "queueReduction", "nextReductionStage"]),
      groupBy: groupFunction as any
    }),
    visual: visualSlice.reducer
  }
})

export type BoardState = ReturnType<typeof store.getState>

export default store

export type Dispatcher = typeof store.dispatch

export const useDispatch: () => Dispatcher = _useDispatch
