import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import {
  VarIndex,
  TreeState,
  Tree,
  initialTreeState,
  ReductionStage,
  VarName,
  NodeID,
  PrimitiveID,
  LambdaReducerID
} from "./types"
import {
  traverseTree,
  partialMapTree,
  createVar,
  createAbs,
  createAppl,
  setNextStage,
  directChildren,
  visibleChildren
} from "./util"

const treeSlice = createSlice({
  name: "tree",
  initialState: initialTreeState as TreeState,
  reducers: {
    clearTree: state => ({ root: "", nodes: {}, primitives: {}, constants: state.constants }),
    setRoot: (state, action: PayloadAction<NodeID>) => {
      state.root = action.payload
    },
    addVariable: (state, action: PayloadAction<{ nodeID: NodeID; index: VarIndex; name: VarName }>) => {
      const { nodeID, index, name } = action.payload
      const varNode = createVar(index, name)
      state.nodes[nodeID] = varNode
    },
    addAbstraction: (state, action: PayloadAction<{ nodeID: NodeID; variableName: VarName; child?: NodeID }>) => {
      const { nodeID, variableName, child } = action.payload
      const absNode = createAbs(variableName, child)
      state.nodes[nodeID] = absNode
    },
    addApplication: (state, action: PayloadAction<{ nodeID: NodeID; left?: NodeID; right?: NodeID }>) => {
      const { nodeID, left, right } = action.payload
      const absNode = createAppl(left, right)
      state.nodes[nodeID] = absNode
    },
    queueReduction: (state, action: PayloadAction<ReductionStage | undefined>) => {
      const reduction = action.payload
      if (reduction) {
        removeReductionPrimitives(state, reduction)
        addReductionPrimitives(state, reduction)
        addReplacementNodes(reduction, state.nodes)
        state.reduction = reduction
      }
    },
    nextReductionStage: state => {
      if (state.reduction) {
        setNextStage(state)
        if (state.reduction) {
          if (state.reduction.type === "SUBSTITUTE") replaceVars(state.reduction, state)
          else if (state.reduction.type === "REMOVE") removeReduced(state)
        }
      }
    },
    setConstant: (state, action: PayloadAction<{ name: string; text: string }>) => {
      const { name, text } = action.payload
      state.constants[name] = text
    },
    setReducer: (state, action: PayloadAction<LambdaReducerID>) => {
      state.reducer = action.payload
    },
    createPrimitive: (state, action: PayloadAction<{ name: string; primID: PrimitiveID; rootID: NodeID }>) => {
      const { name, primID, rootID } = action.payload
      addPrimitive(state, primID, rootID, name)
    },
    destructurePrimitive: (state, action: PayloadAction<PrimitiveID>) => {
      removePrimitive(state, action.payload)
    }
  }
})

export default treeSlice

export const {
  clearTree,
  setRoot,
  addVariable,
  addAbstraction,
  addApplication,
  queueReduction,
  nextReductionStage,
  setConstant,
  setReducer,
  createPrimitive,
  destructurePrimitive
} = treeSlice.actions

const removeReductionPrimitives = (state: TreeState, reduction: ReductionStage) =>
  _.uniq(_.keys(reduction.substitutions).flatMap(replacedID => state.nodes[replacedID].primitives)).forEach(primID =>
    removePrimitive(state, primID)
  )

const addReductionPrimitives = (state: TreeState, reduction: ReductionStage) => {
  _.forEach(reduction.substitutions, sub =>
    _.forEach(sub.primitives, (newID, oldID) => {
      const oldPrim = state.primitives[oldID]
      addPrimitive(state, newID, sub.nodes[oldPrim.rootID], oldPrim.name)
    })
  )
}

const addPrimitive = (state: TreeState, primID: PrimitiveID, rootID: NodeID, name: string) => {
  state.primitives[primID] = { name, rootID }
  state.nodes = {
    ...state.nodes,
    ...partialMapTree(state.nodes, node => ({ ...node, primitives: [...node.primitives, primID] }), rootID)
  }
}

const removePrimitive = (state: TreeState, primitiveID: PrimitiveID) => {
  const primitive = state.primitives[primitiveID]
  if (primitive) {
    delete state.primitives[primitiveID]
    traverseTree(
      state.nodes,
      node => {
        _.remove(node.primitives, primID => primID === primitiveID)
      },
      primitive.rootID
    )
  }
}

const removeReduced = (state: TreeState) => {
  const reduction = state.reduction
  if (reduction) {
    const newChild = directChildren(state.nodes[reduction.abs])[0]
    const replaceRoot = state.root === reduction.parentApplication
    const replaceFrom = reduction.visibleParent === reduction.parentApplication ? state.root : reduction.visibleParent
    replaceChild(reduction.parentApplication, newChild, replaceFrom, state.nodes)
    const toRemove = [..._.keys(reduction.substitutions), reduction.abs, reduction.consumed]
    toRemove.forEach(nodeID => _.unset(state.nodes, nodeID))
    const boundOutsideAbs = new Set(getBoundOutside(state.nodes, reduction.abs))
    const newNodes = new Set(_.flatMap(reduction.substitutions, sub => _.values(sub.nodes)))
    traverseTree(
      state.nodes,
      (node, nodeID) => {
        switch (node.type) {
          case "VARIABLE":
            state.nodes[nodeID] = newNodes.has(nodeID)
              ? node
              : createVar(
                  node.index !== undefined ? node.index - (boundOutsideAbs.has(nodeID) ? 1 : 0) : undefined,
                  node.name,
                  node.primitives
                )
            break
          default:
        }
      },
      newChild
    )
    if (replaceRoot) state.root = newChild
  }
}

const indexFrom = (tree: Tree, goalID: NodeID, rootID: NodeID | undefined, index = 0): VarIndex => {
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

const addReplacementNodes = (reduction: ReductionStage, tree: Tree) =>
  _.forEach(reduction.substitutions, (substitution, toReplace) => {
    const indexOffset = indexFrom(tree, toReplace, reduction.child) || 0

    const getNodeSub = (nodeID: NodeID) => substitution.nodes[nodeID] || nodeID
    const getPrimSub = (primID: PrimitiveID) => substitution.primitives[primID] || primID
    const boundOutsideConsumed = new Set(getBoundOutside(tree, reduction.consumed))

    traverseTree(
      tree,
      (node, nodeID) => {
        const subID = getNodeSub(nodeID)
        switch (node.type) {
          case "VARIABLE": {
            tree[subID] = createVar(
              node.index !== undefined ? node.index + (boundOutsideConsumed.has(nodeID) ? indexOffset : 0) : undefined,
              node.name,
              node.primitives.map(getPrimSub)
            )
            break
          }
          case "ABSTRACTION": {
            tree[subID] = createAbs(
              node.variableName,
              node.child ? getNodeSub(node.child) : node.child,
              node.primitives.map(getPrimSub)
            )
            break
          }
          case "APPLICATION": {
            const newLeft = node.left ? getNodeSub(node.left) : node.left
            const newRight = node.right ? getNodeSub(node.right) : node.right
            tree[subID] = createAppl(newLeft, newRight, node.primitives.map(getPrimSub))
            break
          }
          default:
        }
      },
      reduction.consumed
    )
  })

const getBoundOutside = (tree: Tree, rootID: NodeID, abstractions = 0): NodeID[] => {
  const root = tree[rootID]
  if (!root) return []
  switch (root.type) {
    case "VARIABLE":
      return root.index === undefined || abstractions <= root.index ? [rootID] : []
    case "ABSTRACTION":
      if (!root.child) return []
      return getBoundOutside(tree, root.child, abstractions + 1)
    case "APPLICATION":
      return visibleChildren(root, tree).flatMap(childID => getBoundOutside(tree, childID, abstractions))
    default:
      return []
  }
}

const replaceVars = (reduction: ReductionStage, state: TreeState) => {
  _.forEach(reduction.substitutions || {}, (sub, toReplace: NodeID) =>
    replaceChild(toReplace, sub.nodes[reduction.consumed] || reduction.consumed, state.root, state.nodes)
  )
}

const replaceChild = (oldChild: NodeID, newChild: NodeID, rootID: NodeID, tree: Tree) => {
  traverseTree(
    tree,
    (node, nodeID) => {
      switch (node.type) {
        case "ABSTRACTION":
          if (node.child === oldChild) tree[nodeID] = createAbs(node.variableName, newChild)
          break
        case "APPLICATION":
          tree[nodeID] =
            node.left === oldChild
              ? createAppl(newChild, node.right)
              : node.right === oldChild
              ? createAppl(node.left, newChild)
              : node
          break
        default:
      }
    },
    rootID
  )
}
