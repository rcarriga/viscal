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
  Reduction,
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
        reductions: [...state.reductions, { stage: "CONSUME", applicationID: action.applicationID }]
      }
    case "NEXT_REDUCTION_STAGE":
      if (state.reductions) {
        const current = state.reductions[0]
        const nextStage = getNextStage(current)
        const updated = nextStage ? [{ ...current, stage: nextStage }] : []
        return {
          ...state,
          reductions: [...updated, ..._.tail(state.reductions)]
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

const getNextStage = (reduction: Reduction): ReductionStage | undefined => {
  switch (reduction.stage) {
    case "CONSUME":
      return "UNBIND"
    case "UNBIND":
      return "SUBSTITUTE"
    default:
  }
}

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

const getChildren = (nodeID: NodeID, tree: Tree): NodeID[] => {
  const node = getNode(nodeID, tree)
  const direct = getDirect(node)
  const left = direct ? getNode(direct[0], tree) : undefined
  if (left && left.type === "APPLICATION") {
    return _.concat(getChildren(direct[0], tree), _.slice(direct, 1))
  }
  return direct
}

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
