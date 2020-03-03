import { TreeState, ReductionStage, NodeID } from "board/state"
import { createReduction, isRedex, LambdaReducer } from "./base"

const reduce = (state: TreeState, rootID?: NodeID): ReductionStage | undefined => {
  if (rootID) {
    const root = state.nodes[rootID]
    if (!root) return undefined
    const innerReduction = (() => {
      switch (root.type) {
        case "ABSTRACTION":
          return reduce(state, root.child)
        case "APPLICATION": {
          const [leftID, rightID] = [root.left, root.right]
          return reduce(state, leftID) || reduce(state, rightID)
        }
        default:
      }
    })()
    if (innerReduction) return innerReduction
    if (isRedex(root, state.nodes)) return createReduction(rootID, state)
  }
}

export default {
  name: "Applicative Order",
  description: "Performs applicative order reduction.",
  useReduction: state => reduce(state, state.root)
} as LambdaReducer
