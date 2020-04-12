import { NodeType, directChildren, NodeID, TreeState, Tree, BoardState, ReductionStage } from "board/state"
import { createSelector } from "reselect"

export type NodeJoins = { [nodeID in NodeID]: { distance: number; jointTo: NodeID; type: NodeType } }

const constructJoins = (state: TreeState) => ({
  ...abstractionJoins(state.nodes, state.root, state.reduction),
  ...applicationJoins(state.nodes, state.root)
})

const abstractionJoins = (
  tree: Tree,
  rootID: NodeID = "",
  reduction?: ReductionStage,
  joins: NodeJoins = {},
  parentID: NodeID = ""
): NodeJoins => {
  const parentNode = tree[parentID]
  const root = tree[rootID]
  if (!root) return joins
  if (!parentNode || parentNode.type !== "ABSTRACTION" || root.type !== "ABSTRACTION")
    return directChildren(root).reduce((joins, child) => abstractionJoins(tree, child, reduction, joins, rootID), joins)
  const parentJoin = joins[parentID]
  if (reduction) {
    const reductionAbs = reduction.abs
    const reductionChild = reduction.child
    if (reductionAbs === parentID && reductionChild !== rootID) return joins
  }
  const newJoins = {
    ...joins,
    [rootID]: {
      jointTo: parentJoin ? parentJoin.jointTo : parentID,
      distance: parentJoin ? parentJoin.distance + 1 : 1,
      type: root.type
    }
  }
  return abstractionJoins(tree, root.child, reduction, newJoins, rootID)
}

const applicationJoins = (tree: Tree, rootID: NodeID = "", joins: NodeJoins = {}, parentID: NodeID = ""): NodeJoins => {
  const parentNode = tree[parentID]
  const root = tree[rootID]
  if (!root) return joins
  if (!parentNode || parentNode.type !== "APPLICATION" || root.type !== "APPLICATION")
    return directChildren(root).reduce((joins, child) => applicationJoins(tree, child, joins, rootID), joins)
  const parentJoin = joins[parentID]
  const newJoins = {
    ...joins,
    [rootID]: {
      jointTo: parentJoin ? parentJoin.jointTo : parentID,
      distance: parentJoin ? parentJoin.distance + 1 : 1,
      type: root.type
    }
  }
  return {
    ...applicationJoins(tree, root.left, newJoins),
    ...applicationJoins(tree, root.right, newJoins, rootID)
  }
}

export const joinsSelector = createSelector((state: BoardState) => state.tree.present, constructJoins)
