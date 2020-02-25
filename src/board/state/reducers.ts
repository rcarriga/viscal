import { combineReducers } from "redux"
import undoable, { includeAction } from "redux-undo"
import { TreeAction } from "./tree/actions"
import { tree } from "./tree/reducers"
import { visual } from "./visual/reducers"

const include = (actions: TreeAction["type"][]) => includeAction(actions)

const board = combineReducers({
  tree: undoable(tree, { filter: include(["QUEUE_REDUCTION", "NEXT_REDUCTION_STAGE"]) }),
  visual
})
export default board
