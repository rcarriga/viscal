import { parentsSelector } from "./parents"
import { TreeState, NodeID, VarIndex, Tree, TreeNode } from ".."

export const getVariableBinder = (
  nodeID: NodeID | undefined = undefined,
  index: VarIndex,
  tree: TreeState
): NodeID | undefined => {
  if (!nodeID || index < 0) return undefined
  const parents = parentsSelector(tree)
  const node = getNode(nodeID, tree.nodes)
  if (node.type === "ABSTRACTION")
    return index === 0 ? nodeID : getVariableBinder(parents[nodeID], index - 1, tree)
  else return parents[nodeID] ? getVariableBinder(parents[nodeID], index, tree) : undefined
}

export const getNode = (nodeID: NodeID, tree: Tree): TreeNode => {
  return tree[nodeID] || { type: "NULL", children: [] }
}
