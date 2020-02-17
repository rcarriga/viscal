import { TreeState, ReductionStage } from "board/state"
import { createReduction, isRedex, LambdaReducer } from "./base"

const reduce = (state: TreeState): ReductionStage | undefined => {
  if (state.root) {
    const root = state.nodes[state.root]
    if (isRedex(root, state.nodes)) return createReduction(state.root, state)
    const leftID = root.type === "APPLICATION" && root.left
    if (leftID) {
      return reduce({ ...state, root: leftID })
    }
  }
}

const normalReducer: LambdaReducer = {
  name: "Normal Order",
  description: "Performs normal order reduction...",
  reduce
}

export default normalReducer
