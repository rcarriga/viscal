import _ from "lodash"
import { BoardAction } from "../actions"
import { parentsSelector } from "./selectors"
import {
  VarIndex,
  TreeState,
  TreeNode,
  NodeID,
  Tree,
  initialTreeState,
  ReductionStage
} from "./types"

export const tree = (state = initialTreeState, action: BoardAction): TreeState => {
  switch (action.type) {
    case "SET_ROOT":
      return { ...state, root: action.nodeID }
    case "ADD_VARIABLE":
      return addNode(state, action.nodeID, {
        type: "VARIABLE",
        index: action.index,
        name: action.name,
        children: () => [],
        binder: tree => getBinder(action.nodeID, action.index, tree)
      })
    case "ADD_ABSTRACTION":
      return addNode(state, action.nodeID, {
        type: "ABSTRACTION",
        variableName: action.variableName,
        child: action.child,
        children: tree => getChildren(action.nodeID, tree)
      })
    case "ADD_APPLICATION":
      return addNode(state, action.nodeID, {
        type: "APPLICATION",
        left: action.left,
        right: action.right,
        children: tree => getChildren(action.nodeID, tree)
      })
    case "QUEUE_REDUCTION":
      return {
        ...state,
        reduction: { type: "APPLY", parent: action.parent }
      }
    case "NEXT_REDUCTION_STAGE":
      if (state.reduction) {
        return {
          ...state,
          reduction: getNextStage(state.reduction, state.nodes)
        }
      }
      return state
    default:
      return state
  }
}

const addNode = (state: TreeState, nodeID: NodeID, expr: TreeNode): TreeState => {
  return {
    ...state,
    nodes: {
      ...state.nodes,
      [nodeID]: expr
    }
  }
}

const getNextStage = (reduction: ReductionStage, tree: Tree): ReductionStage | undefined => {
  switch (reduction.type) {
    case "APPLY":
      return { type: "CONSUME", parent: reduction.parent }
    // case "CONSUME":
    //   return { type: "UNBIND", parent: reduction.parent }
    // case "UNBIND":
    //   return { type: "SUBSTITUTE", parent: reduction.parent, substitutions: {} }
    // case "SUBSTITUTE":
    default:
      return undefined
  }
}

/**
 * Get the ID of the abstraction which binds a variable.
 * Returns undefined for free variables or non variable nodes.
 *
 * @function getBinder
 * @param {NodeID|undefined} nodeID - Node to search from.
 * @param {VarIndex} index - DeBruijn index of the variable to search for.
 * @param {TreeState} tree - Tree to search down.
 * @return {NodeID|undefined} ID of binding abstraction if found.
 */
const getBinder = (
  nodeID: NodeID | undefined = undefined,
  index: VarIndex,
  tree: TreeState
): NodeID | undefined => {
  if (!nodeID || index < 0) return undefined
  const parents = parentsSelector(tree)
  const node = getNode(nodeID, tree.nodes)
  if (node.type === "ABSTRACTION")
    return index === 0 ? nodeID : getBinder(parents[nodeID], index - 1, tree)
  else return parents[nodeID] ? getBinder(parents[nodeID], index, tree) : undefined
}

const getNode = (nodeID: NodeID, tree: Tree): TreeNode => {
  return tree[nodeID] || { type: "NULL", children: [] }
}

/**
 * Get the children for a node after filtering out redundant applications.
 *
 * @function getChildren
 * @param {NodeID} nodeID - Node to get children of.
 * @param {Tree} tree - Tree to retrieve children from.
 * @return {NodeID[]} List of children parented by given node.
 */
const getChildren = (nodeID: NodeID, tree: Tree): NodeID[] => {
  const node = getNode(nodeID, tree)
  const direct = getDirect(node)
  const left = direct ? getNode(direct[0], tree) : undefined
  if (left && left.type === "APPLICATION") {
    return _.concat(getChildren(direct[0], tree), _.slice(direct, 1))
  }
  return direct
}

/**
 * Get the direct children for a node.
 * This means to not exclude redundant applications.
 *
 * @function getDirect
 * @param {TreeNode} node - The node to get children of.
 * @return {NodeID[]} List of children directly under the given node.
 */
const getDirect = (node: TreeNode): NodeID[] => {
  return _.filter(
    node.type === "ABSTRACTION"
      ? [node.child]
      : node.type === "APPLICATION"
      ? [node.left, node.right]
      : [],
    _.isString
  )
}
