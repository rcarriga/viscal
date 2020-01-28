import { BoardAction } from "../actions"
import { parentsSelector } from "./selectors"
import {
  VarIndex,
  TreeState,
  TreeNode,
  Tree,
  initialTreeState,
  ReductionStage,
  VarName,
  NodeID,
  REDUCTION_STAGES
} from "./types"
import {reduceTree} from "./util"
import {mapTree} from "./util"
import {isString} from "util"
import {isString} from "util"

export const tree = (state = initialTreeState, action: BoardAction): TreeState => {
  switch (action.type) {
    case "SET_ROOT":
      return { ...state, root: action.nodeID }
    case "ADD_VARIABLE":
      return addNode(state, action.nodeID, createVar(action.nodeID, action.index, action.name))
    case "ADD_ABSTRACTION":
      return addNode(state, action.nodeID, createAbs(action.nodeID, action.variableName, action.child))
    case "ADD_APPLICATION":
      return addNode(state, action.nodeID, createAppl(action.nodeID, action.left, action.right))
    case "QUEUE_REDUCTION": {
      if (action.reduction) {
        const withReduction: TreeState = {
          ...state,
          reduction: action.reduction
        }
        return { ...withReduction, nodes: addReplacementNodes(action.reduction, state.nodes) }
      }
      return state
    }
    case "NEXT_REDUCTION_STAGE":
      if (state.reduction) {
        const stage = getNextStage(state.reduction)
        if (!stage) return { ...state, reduction: undefined }
        switch (stage.type) {
          case "SUBSTITUTE":
            return replaceNodes(state.reduction, { ...state, reduction: stage })
          case "REMOVE": {
            const newChild = state.nodes[stage.abs].directChildren[0]
            const newTree = replaceChild(stage.parentApplication, newChild, stage.visibleParent, state.nodes)
            return {
              ...state,
              reduction: stage,
              nodes: newTree
            }
          }
          default:
            return {
              ...state,
              reduction: stage
            }
        }
      }
      return state
    default:
      return state
  }
}

const addReplacementNodes = (reduction: ReductionStage, tree: Tree): Tree =>
  Object.keys(reduction.substitutions).reduce((tree: Tree, toReplace: NodeID) => {
    const substitution = reduction.substitutions[toReplace]
    const calcOffset = (offset: number, nodeID?: NodeID): VarIndex => {
      if (!nodeID) return undefined
      const node = tree[nodeID]
      if (!node) return undefined
      switch (node.type) {
        case "VARIABLE":
          return nodeID === toReplace ? offset : undefined
        case "ABSTRACTION":
          return node.child ? calcOffset(offset + 1, node.child) : undefined
        case "APPLICATION": {
          const left = calcOffset(offset, node.left)
          return typeof left === "number" ? left : calcOffset(offset, node.right)
        }
        default:
          return undefined
      }
    }

    const indexOffset = calcOffset(0, reduction.child) || 0

    const getSub = (nodeID: NodeID) => substitution[nodeID] || nodeID
    const subTree = reduceTree(
      tree,
      (tree, node, nodeID) => {
        const updated = () => {
          switch (node.type) {
            case "VARIABLE":
              return createVar(
                getSub(nodeID),
                node.index !== undefined ? node.index + indexOffset : undefined,
                node.name
              )
            case "ABSTRACTION":
              return createAbs(getSub(nodeID), node.variableName, node.child ? getSub(node.child) : node.child)
            case "APPLICATION": {
              const newLeft = node.left ? getSub(node.left) : node.left
              const newRight = node.right ? getSub(node.right) : node.right
              return createAppl(getSub(nodeID), newLeft, newRight)
            }
            default:
              return node
          }
        }
        return {
          ...tree,
          [getSub(nodeID)]: updated()
        }
      },
      {},
      reduction.consumed
    )

    return { ...tree, ...subTree }
  }, tree)

const replaceNodes = (reduction: ReductionStage, state: TreeState): TreeState => {
  const root = state.root
  return root
    ? {
        ...state,
        nodes: Object.keys(reduction.substitutions).reduce((tree: Tree, toReplace: NodeID) => {
          const getSub = (nodeID: NodeID) => reduction.substitutions[toReplace][nodeID] || nodeID
          return replaceChild(toReplace, getSub(reduction.consumed), root, tree)
        }, state.nodes)
      }
    : state
}

const replaceChild = (oldChild: NodeID, newChild: NodeID, rootID: NodeID, tree: Tree): Tree => {
  return mapTree(
    tree,
    (node, nodeID) => {
      switch (node.type) {
        case "VARIABLE":
          return node
        case "ABSTRACTION":
          return node.child === oldChild ? createAbs(nodeID, node.variableName, newChild) : node
        case "APPLICATION":
          return node.left === oldChild
            ? createAppl(nodeID, newChild, node.right)
            : node.right === oldChild
            ? createAppl(nodeID, node.left, newChild)
            : node
        default:
          return node
      }
    },
    rootID
  )
}

const createVar = (nodeID: NodeID, index: VarIndex, name: VarName): TreeNode => ({
  type: "VARIABLE",
  index: index,
  name: name,
  children: () => [],
  directChildren: [],
  binder: tree => getBinder(nodeID, index, tree)
})

const createAbs = (nodeID: NodeID, variableName: VarName, child?: NodeID): TreeNode => ({
  type: "ABSTRACTION",
  variableName: variableName,
  child: child,
  directChildren: [child].filter(isString),
  children: tree => getChildren(nodeID, tree)
})

const createAppl = (nodeID: NodeID, left?: NodeID, right?: NodeID): TreeNode => ({
  type: "APPLICATION",
  left: left,
  right: right,
  directChildren: [left, right].filter(isString),
  children: tree => getChildren(nodeID, tree)
})

const addNode = (state: TreeState, nodeID: NodeID, expr: TreeNode): TreeState => {
  return {
    ...state,
    nodes: {
      ...state.nodes,
      [nodeID]: expr
    }
  }
}

const getNextStage = (reduction: ReductionStage): ReductionStage | undefined => {
  const stage = REDUCTION_STAGES[REDUCTION_STAGES.indexOf(reduction.type) + 1]
  return stage ? { ...reduction, type: stage } : undefined
}

const getBinder = (
  nodeID: NodeID | undefined = undefined,
  index: VarIndex | undefined,
  tree: TreeState
): NodeID | undefined => {
  if (!nodeID || index === undefined) return undefined
  const parents = parentsSelector(tree)
  const node = getNode(nodeID, tree.nodes)
  if (node.type === "ABSTRACTION") return index === 0 ? nodeID : getBinder(parents[nodeID], index - 1, tree)
  else return parents[nodeID] ? getBinder(parents[nodeID], index, tree) : undefined
}

const getNode = (nodeID: NodeID, tree: Tree): TreeNode => {
  return tree[nodeID] || { type: "NULL", children: [] }
}

const getChildren = (nodeID: NodeID, tree: Tree): NodeID[] => {
  const node = getNode(nodeID, tree)
  const left = node.directChildren ? getNode(node.directChildren[0], tree) : undefined
  if (left && left.type === "APPLICATION") {
    return [...getChildren(node.directChildren[0], tree), ...node.directChildren.slice(1)]
  }
  return node.directChildren
}
