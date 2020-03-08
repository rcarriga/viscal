import { combineReducers } from "redux"
import undoable, { includeAction } from "redux-undo"
import treeSlice from "./tree/reducers"
import visualSlice from "./visual/reducers"

type TreeAction = keyof typeof treeSlice.actions

const include = (actions: TreeAction[]) => includeAction(actions)

const board = combineReducers({
  tree: undoable(treeSlice.reducer, {
    ignoreInitialState: true,
    filter: include(["setRoot", "queueReduction", "nextReductionStage"])
  }),
  visual: visualSlice.reducer
})

export default board
