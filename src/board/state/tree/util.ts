import { TreeState, NodeID, VarIndex } from "./types"

export const getVariableBinder = (
  nodeID: NodeID | undefined = undefined,
  index: VarIndex,
  tree: TreeState
): NodeID | undefined => {
  if (!nodeID || index < 0) return undefined
  const node = tree.nodes[nodeID]
  if (node.type === "ABSTRACTION")
    return index === 0 ? nodeID : getVariableBinder(node.parentID, index - 1, tree)
  else return node.parentID ? getVariableBinder(node.parentID, index, tree) : undefined
}
