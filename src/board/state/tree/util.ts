import { isString } from "../../util"
import {
  Tree,
  TreeNode,
  NodeID,
  VarIndex,
  VarName,
  PrimitiveID,
  TreeState,
  REDUCTION_STAGES,
  parentsSelector,
  Primitive
} from "."
/**
 * Depth first search through the tree for first node to pass a predicate.
 *
 * @function searchTree
 * @param tree - Tree to search for in node.
 * @param f - Predicate function to receive a node and ID to return a boolean
 * @return First node to match predicate
 */
export const searchTree = (
  tree: Tree,
  f: (node: TreeNode, nodeID: NodeID) => boolean,
  rootID: NodeID
): NodeID | undefined => {
  const root = tree[rootID]
  if (f(root, rootID)) return rootID
  switch (root.type) {
    case "ABSTRACTION":
      return root.child ? searchTree(tree, f, root.child) : undefined
    case "APPLICATION":
      return (
        (root.left ? searchTree(tree, f, root.left) : undefined) ||
        (root.right ? searchTree(tree, f, root.right) : undefined)
      )
    default:
      return undefined
  }
}

/**
 * Apply a function to nodes in a tree.
 * Function is applied in depth first order.
 * Any nodes not mapped over are returned as is.
 *
 * @function mapTree
 * @param tree - Tree to map over
 * @param f - Function to apply to each node
 * @return Tree with mapped nodes
 */
export const partialMapTree = (tree: Tree, f: (node: TreeNode, nodeID: NodeID) => TreeNode, rootID: NodeID): Tree => {
  return reduceTree(tree, (tree, node, nodeID) => ({ ...tree, [nodeID]: f(node, nodeID) }), tree, rootID)
}

/**
 * Reduce across a tree in depth first order
 *
 * @function reduceTree
 * @param tree - Tree to reduce
 * @param f - Function to receive each node along with the accumulator
 * @param accum - Initial accumulator value
 * @param rootID - Node to begin from
 * @return Final accumulator
 */
export const reduceTree = <A>(
  tree: Tree,
  f: (accum: A, node: TreeNode, nodeID: NodeID) => A,
  accum: A,
  rootID: NodeID
): A => {
  const root = tree[rootID]
  if (!root) return accum
  const updated = f(accum, root, rootID)
  switch (root.type) {
    case "VARIABLE":
      return updated
    case "ABSTRACTION":
      return root.child ? reduceTree(tree, f, updated, root.child) : updated
    case "APPLICATION":
      return [root.left, root.right]
        .filter(isString)
        .reduce((updated, childID) => reduceTree(tree, f, updated, childID), updated)
    default:
      return accum
  }
}

export const traverseTree = (tree: Tree, f: (node: TreeNode, nodeID: NodeID) => void, rootID: NodeID) => {
  return reduceTree(
    tree,
    (_, node, nodeID) => {
      f(node, nodeID)
      return undefined
    },
    undefined,
    rootID
  )
}

export const createVar = (index: VarIndex, name: VarName, primitives: PrimitiveID[] = []): TreeNode => ({
  type: "VARIABLE",
  index: index,
  name: name,
  primitives
})

export const createAbs = (variableName: VarName, child?: NodeID, primitives: PrimitiveID[] = []): TreeNode => ({
  type: "ABSTRACTION",
  variableName: variableName,
  child: child,
  primitives
})

export const createAppl = (left?: NodeID, right?: NodeID, primitives: PrimitiveID[] = []): TreeNode => ({
  type: "APPLICATION",
  left: left,
  right: right,
  primitives
})

export const setNextStage = (state: TreeState) => {
  const prev = state.reduction
  if (prev) {
    const stage = REDUCTION_STAGES[REDUCTION_STAGES.indexOf(prev.type) + 1]
    state.reduction = stage ? { ...prev, type: stage } : undefined
  }
}

export const binder = (tree: TreeState, nodeID: NodeID): NodeID | undefined => {
  const varNode = tree.nodes[nodeID]
  if (varNode.type !== "VARIABLE") return undefined
  return getBinder(tree, nodeID, varNode.index)
}
const getBinder = (tree: TreeState, nodeID: NodeID | undefined, index: VarIndex): NodeID | undefined => {
  if (!nodeID || index === undefined) return undefined
  const parents = parentsSelector(tree)
  const node = getNode(nodeID, tree.nodes)
  if (node.type === "ABSTRACTION") return index === 0 ? nodeID : getBinder(tree, parents[nodeID], index - 1)
  else return parents[nodeID] ? getBinder(tree, parents[nodeID], index) : undefined
}

export const getNode = (nodeID: NodeID, tree: Tree): TreeNode => {
  return tree[nodeID] || { type: "NULL", children: [] }
}

export const directChildren = (node: TreeNode): NodeID[] => {
  switch (node.type) {
    case "ABSTRACTION":
      return node.child ? [node.child] : []
    case "APPLICATION":
      return [node.left, node.right].filter(isString)
    default:
      return []
  }
}
export const visibleChildren = (nodeID: NodeID | TreeNode, tree: Tree): NodeID[] => {
  const node = typeof nodeID === "object" ? nodeID : getNode(nodeID, tree)
  const left = directChildren(node)[0] ? getNode(directChildren(node)[0], tree) : undefined
  if (left && left.type === "APPLICATION") {
    return [...visibleChildren(directChildren(node)[0], tree), ...directChildren(node).slice(1)]
  }
  return directChildren(node)
}

export const indexFrom = (tree: Tree, goalID: NodeID, rootID: NodeID | undefined, index = 0): VarIndex => {
  if (!rootID) return undefined
  const node = tree[rootID]
  if (!node) return undefined
  switch (node.type) {
    case "VARIABLE":
      return rootID === goalID ? index : undefined
    case "ABSTRACTION":
      return indexFrom(tree, goalID, node.child, index)
    case "APPLICATION": {
      const left = indexFrom(tree, goalID, node.left, index)
      return left === undefined ? indexFrom(tree, goalID, node.right, index) : left
    }
    default:
      return undefined
  }
}

export const getPrimitive = (nodeID: NodeID | TreeNode, state: TreeState): Primitive | undefined => {
  const node = typeof nodeID === "object" ? nodeID : state.nodes[nodeID]
  if (node?.primitives.length) {
    return state.primitives[node.primitives[node.primitives.length - 1]]
  }
}
