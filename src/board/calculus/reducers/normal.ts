import { TreeState } from "board/state"
import { createReduction, isRedex, LambdaReducer } from "./base"

const normalReducer: LambdaReducer = {
  name: "Normal Order",
  description: "Performs normal order reduction...",
  reduce: (state: TreeState) => {
    if (state.root && isRedex(state.nodes[state.root], state.nodes)) return createReduction(state.root, state)
  }
}

export default normalReducer

