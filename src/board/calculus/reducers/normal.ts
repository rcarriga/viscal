import { TreeState, ReductionStage, NodeID } from "board/state"
import { createReduction, isRedex, LambdaReducer } from "./base"

const reduce = (state: TreeState, rootID?: NodeID): ReductionStage | undefined => {
  if (rootID) {
    const root = state.nodes[rootID]
    if (!root) return undefined
    if (isRedex(root, state.nodes)) return createReduction(rootID, state)
    switch (root.type) {
      case "ABSTRACTION":
        return reduce(state, root.child)
      case "APPLICATION": {
        const [leftID, rightID] = [root.left, root.right]
        return reduce(state, leftID) || reduce(state, rightID)
      }
      default:
    }
  }
}

const normalReducer: LambdaReducer = {
  name: "Normal Order",
  description: "Performs normal order reduction...",
  reduce: state => reduce(state, state.root)
}

export default normalReducer
