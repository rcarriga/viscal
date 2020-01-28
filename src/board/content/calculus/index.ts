import { TreeState, NodeID, Substitutions, Tree, Substitution, ReductionStage, REDUCTION_STAGES } from "../../state"
import { searchTree } from "../../state/tree/reducers"
import { generateID } from "../util"

export const createReduction = (parentID: NodeID, tree: TreeState): ReductionStage | undefined => {
  const parentNode = tree.nodes[parentID]
  if (!parentNode) return undefined
  const [abs, consumed] = parentNode.children(tree.nodes)
  const directParent = searchTree(tree.nodes, node => node.directChildren[0] === abs, parentID)
  if (!directParent) return undefined // Should not be possible
  if (!abs || !consumed || !tree.nodes[abs] || !tree.nodes[consumed]) return undefined
  const child = tree.nodes[abs].children(tree.nodes)[0]
  if (tree.nodes[parentID])
    return {
      type: REDUCTION_STAGES[0],
      visibleParent: parentID,
      parentApplication: directParent,
      abs,
      child,
      consumed,
      substitutions: createSubstitutions(abs, consumed, tree)
    }
}

const createSubstitutions = (absID: NodeID, consumedID: NodeID, tree: TreeState): Substitutions => {
  const removed = getRemoved(absID, tree)
  return removed
    .map((nodeID, index) => ({ [nodeID]: index === -1 ? {} : createCopyIDs(consumedID, tree.nodes) }))
    .reduce((prev, cur) => ({ ...prev, ...cur }))
}

const createCopyIDs = (nodeID: NodeID, tree: Tree): Substitution => {
  const node = tree[nodeID]
  if (!node) return {}
  return node.directChildren
    .map(nodeID => createCopyIDs(nodeID, tree))
    .reduce((subs, sub) => ({ ...subs, ...sub }), { [nodeID]: generateID() })
}

const getRemoved = (binderID: NodeID, tree: TreeState): NodeID[] => {
  const nodes = tree.nodes
  return Object.keys(tree.nodes).filter(nodeID => {
    const node = nodes[nodeID]
    return node.type === "VARIABLE" && node.binder(tree) === binderID
  })
}
