import { BoardAction } from "../actions"
import { parentsSelector } from "./selectors"
import { VarIndex, TreeState, TreeNode, NodeID, Tree, initialTreeState, ReductionStage, Substitution } from "./types"

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
        directChildren: [],
        binder: tree => getBinder(action.nodeID, action.index, tree)
      })
    case "ADD_ABSTRACTION":
      return addNode(state, action.nodeID, {
        type: "ABSTRACTION",
        variableName: action.variableName,
        child: action.child,
        directChildren: [action.child].filter(isString),
        children: tree => getChildren(action.nodeID, tree)
      })
    case "ADD_APPLICATION":
      return addNode(state, action.nodeID, {
        type: "APPLICATION",
        left: action.left,
        right: action.right,
        directChildren: [action.left, action.right].filter(isString),
        children: tree => getChildren(action.nodeID, tree)
      })
    case "QUEUE_REDUCTION":
      return state.nodes[action.parent]
        ? {
            ...state,
            reduction: { type: "APPLY", parent: action.parent, substitutions: action.substitutions }
          }
        : state
    case "NEXT_REDUCTION_STAGE":
      if (state.reduction) {
        const stage = getNextStage(state.reduction)
        if (!stage) return state
        switch (stage.type) {
          case "UNBIND":
            return {
              ...performReduction(stage, state),
              reduction: stage
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

const performReduction = (reduction: ReductionStage, state: TreeState): TreeState => {
  const rootID = state.root
  if (!rootID) return state
  const parentNode = state.nodes[reduction.parent]
  const children = parentNode.children(state.nodes)
  const [absID, consumedID] = children
  const tree = removeAbs(absID, rootID, state.nodes)

  const performSubstitution = (toReplace: NodeID, substitution: Substitution, tree: Tree): Tree => {
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

    const indexOffset = calcOffset(0, absID) || 0

    const subTree = reduceTree(
      tree,
      (tree, node, nodeID) => {
        const updated = () => {
          switch (node.type) {
            case "VARIABLE":
              return { ...node, index: node.index !== undefined ? node.index + indexOffset : undefined }
            case "ABSTRACTION":
              return { ...node, child: node.child ? substitution[node.child] || node.child : node.child }
            case "APPLICATION": {
              const newLeft = node.left ? substitution[node.left] : node.left
              const newRight = node.right ? substitution[node.right] : node.right
              return {
                ...node,
                left: newLeft,
                right: newRight,
                directChildren: [newLeft, newRight].filter(isString)
              }
            }
            default:
              return node
          }
        }
        return {
          ...tree,
          [substitution[nodeID] || nodeID]: updated()
        }
      },
      {},
      consumedID
    )

    return replaceChild(toReplace, substitution[consumedID], rootID, { ...tree, ...subTree })
  }

  const substituted = Object.keys(reduction.substitutions).reduce(
    (tree, toReplace) => performSubstitution(toReplace, reduction.substitutions[toReplace], tree),
    tree
  )

  return { ...state, nodes: substituted }

  // const newParent = children.length > 2 ? {...parentNode, }
}

const removeAbs = (absID: NodeID, rootID: NodeID, tree: Tree): Tree => {
  const abs = tree[absID]
  if (abs.type !== "ABSTRACTION" || !abs.child) return tree
  const childLifted = replaceChild(absID, abs.child, rootID, tree)
  delete childLifted[absID]
  return childLifted
}

const replaceChild = (oldChild: NodeID, newChild: NodeID, rootID: NodeID, tree: Tree): Tree => {
  return mapTree(
    tree,
    node => {
      switch (node.type) {
        case "VARIABLE":
          return node
        case "ABSTRACTION":
          if (node.child === oldChild) return { ...node, child: newChild }
          return node
        case "APPLICATION":
          if (node.left === oldChild)
            return { ...node, left: newChild, directChildren: [newChild, node.directChildren[1]].filter(isString) }
          if (node.right === oldChild)
            return { ...node, right: newChild, directChildren: [node.directChildren[0], newChild].filter(isString) }
          return node
        default:
          return node
      }
    },
    rootID
  )
}

const searchTree = (tree: Tree, f: (node: TreeNode, nodeID: NodeID) => boolean, rootID: NodeID): NodeID | undefined => {
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

const mapTree = (tree: Tree, f: (node: TreeNode, nodeID: NodeID) => TreeNode, rootID: NodeID): Tree => {
  return reduceTree(tree, (tree, node, nodeID) => ({ ...tree, [nodeID]: f(node, nodeID) }), tree, rootID)
}

const reduceTree = <A>(tree: Tree, f: (accum: A, node: TreeNode, nodeID: NodeID) => A, accum: A, rootID: NodeID): A => {
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
  switch (reduction.type) {
    case "APPLY":
      return { ...reduction, type: "CONSUME" }
    case "CONSUME":
      return { ...reduction, type: "UNBIND" }
    case "UNBIND":
      return { ...reduction, type: "SUBSTITUTE" }
    default:
      return undefined
  }
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

const isString = (str: string | undefined): str is string => !!str // Allows typechecking
