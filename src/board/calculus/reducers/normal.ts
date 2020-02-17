import { TreeState, ReductionStage, NodeID } from "board/state"
import { createReduction, isRedex, LambdaReducer } from "./base"

const reduce = (state: TreeState, rootID?: NodeID): ReductionStage | undefined => {
  if (rootID) {
    const root = state.nodes[rootID]
    if (isRedex(root, state.nodes)) return createReduction(rootID, state)
    const leftID = root.type === "APPLICATION" && root.left
    if (leftID) {
      return reduce(state, leftID)
    }
  }
}

const normalReducer: LambdaReducer = {
  name: "Normal Order",
  description: "Performs normal order reduction...",
  reduce: state => reduce(state, state.root)
}

export default normalReducer
