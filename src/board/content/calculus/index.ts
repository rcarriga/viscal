import { TreeState, NodeID, Substitutions, Tree, Substitution } from "../../state"
import { generateID } from "../util"

export const createSubstitutions = (absID: NodeID, consumedID: NodeID, tree: TreeState): Substitutions => {
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

