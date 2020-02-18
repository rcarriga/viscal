import {
  TreeState,
  NodeID,
  Substitutions,
  Tree,
  TreeNode,
  Substitution,
  ReductionStage,
  REDUCTION_STAGES,
  searchTree
} from "board/state"
export interface LambdaReducer {
  name: string
  description: string
  reduce: (tree: TreeState) => ReductionStage | undefined
}

export const createReduction = (parentID: NodeID, tree: TreeState): ReductionStage | undefined => {
  const parentNode = tree.nodes[parentID]
  if (!parentNode || parentNode.type !== "APPLICATION") return undefined
  const abs = parentNode.left
  const consumed = parentNode.right
  if (!abs || !consumed || !tree.nodes[abs] || !tree.nodes[consumed]) return undefined
  const visibleParent = getVisibleParent(abs, tree)
  if (!visibleParent) return undefined
  const child = tree.nodes[abs].children(tree.nodes)[0]
  if (tree.nodes[parentID])
    return {
      type: REDUCTION_STAGES[0],
      visibleParent: visibleParent,
      parentApplication: parentID,
      abs,
      child,
      consumed,
      substitutions: createSubstitutions(abs, consumed, tree),
      reducer: ""
    }
}

export const isRedex = (node: TreeNode, tree: Tree): boolean => {
  return !(
    node.type !== "APPLICATION" ||
    !node.left ||
    !node.right ||
    !tree[node.left] ||
    !tree[node.right] ||
    tree[node.left].type !== "ABSTRACTION"
  )
}

const getVisibleParent = (nodeID: NodeID, state: TreeState): NodeID | undefined => {
  const parentID = searchTree(state.nodes, node => node.children(state.nodes).indexOf(nodeID) !== -1, state.root || "")
  return parentID
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

const generateID = (): NodeID => {
  return "_" + (Number(String(Math.random()).slice(2)) + Date.now() + Math.round(performance.now())).toString(36)
}
