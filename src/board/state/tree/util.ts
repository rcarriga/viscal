import { isString } from "../../util"
import { Tree, TreeNode, NodeID } from "."
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
 *
 * @function mapTree
 * @param tree - Tree to map over
 * @param f - Function to apply to each node
 * @return Tree with mapped nodes
 */
export const mapTree = <A>(tree: Tree, f: (node: TreeNode, nodeID: NodeID) => A, rootID: NodeID): {[nodeID in NodeID]: A} => {
  return reduceTree(tree, (tree, node, nodeID) => ({ ...tree, [nodeID]: f(node, nodeID) }), {}, rootID)
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
 * @param node - k
 * @param nodeID - k
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

