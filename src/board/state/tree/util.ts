import { TreeState, NodeID, VarIndex, VARIABLE, APPLICATION } from "./types"

export const getVariableBinder = (
  nodeID: NodeID,
  index: VarIndex,
  tree: TreeState
): NodeID | undefined => {
  const node = tree.nodes[nodeID]
  if (index < 0) return undefined
  if (node.type === APPLICATION || node.type === VARIABLE || !node.parentID)
    return node.parentID ? getVariableBinder(node.parentID, index, tree) : undefined
  else {
    return index === 0 ? nodeID : getVariableBinder(node.parentID, index - 1, tree)
  }
}
