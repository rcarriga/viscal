import { NodeID, TreeState, reduceTree, BoardState } from "board/state"
import { createSelector } from "reselect"

export type NodeJoins = { [nodeID in NodeID]: { distance: number; jointTo: NodeID } }

export const constructJoins = (state: TreeState) => {
  const joins = reduceTree(
    state.nodes,
    (overrideState: { joins: NodeJoins; parentID: NodeID }, node, nodeID) => {
      switch (node.type) {
        case "ABSTRACTION": {
          const { parentID, joins } = overrideState
          const parentNode = state.nodes[parentID]
          const newJoins = () => {
            switch (parentNode ? parentNode.type : undefined) {
              case "ABSTRACTION": {
                const parentJoin = joins[parentID]
                if (state.reduction) {
                  const reductionAbs = state.reduction.abs
                  const reductionChild = state.reduction.child
                  if (reductionAbs === parentID && reductionChild !== nodeID) return joins
                }
                return {
                  ...joins,
                  [nodeID]: {
                    jointTo: parentJoin ? joins[parentID].jointTo : parentID,
                    distance: parentJoin ? parentJoin.distance + 1 : 1
                  }
                }
              }
              default:
                return joins
            }
          }
          return { parentID: nodeID, joins: newJoins() }
        }
        default:
          break
      }
      return { ...overrideState, parentID: nodeID }
    },
    { joins: {}, parentID: "" },
    state.root
  ).joins
  console.log(joins)
  return joins
}

export const joinsSelector = createSelector((state: BoardState) => state.tree.present, constructJoins)
