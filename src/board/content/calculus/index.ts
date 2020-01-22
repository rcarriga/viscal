import { TreeState, NodeID, Substitutions, Tree, Substitution } from "../../state"

export const createSubstitutions = (absID: NodeID, consumedID: NodeID, tree: TreeState): Substitutions => {
  const removed = getRemoved(absID, tree)
  return removed
    .map(nodeID => ({ [nodeID]: createCopyIDs(consumedID, tree.nodes) }))
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

const generateID = (): NodeID => {
  return "_" + (Number(String(Math.random()).slice(2)) + Date.now() + Math.round(performance.now())).toString(36)
}
