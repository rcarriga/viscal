import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import {
  TreeState,
  Tree,
  initialTreeState,
  ReductionStage,
  VarName,
  NodeID,
  PrimitiveID,
  LambdaReducerID
} from "./types"
import { traverseTree, partialMapTree, createVar, createAbs, createAppl, setNextStage, directChildren } from "./util"

const treeSlice = createSlice({
  name: "tree",
  initialState: initialTreeState,
  reducers: {
    clearTree: state => ({ root: "", originalRoot: "", nodes: {}, primitives: {}, constants: state.constants }),
    setRoot: (state, action: PayloadAction<NodeID>) => {
      state.root = action.payload
      if (!state.originalRoot) state.originalRoot = action.payload
    },
    resetRoot: state => {
      state.root = state.originalRoot
    },
    addVariable: (state, action: PayloadAction<{ nodeID: NodeID; binder?: NodeID; name: VarName }>) => {
      const { nodeID, binder, name } = action.payload
      const varNode = createVar(name, binder)
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
        addReplacementNodes(reduction, state)
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
  resetRoot,
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
    if (replaceRoot) state.root = newChild
  }
}

const addReplacementNodes = (reduction: ReductionStage, state: TreeState) => {
  const tree = state.nodes
  _.forEach(reduction.substitutions, substitution => {
    const getNodeSub = (nodeID: NodeID) => substitution.nodes[nodeID] || nodeID
    const getPrimSub = (primID: PrimitiveID) => substitution.primitives[primID] || primID

    traverseTree(
      tree,
      (node, nodeID) => {
        const subID = getNodeSub(nodeID)
        switch (node.type) {
          case "VARIABLE": {
            tree[subID] = createVar(node.name, node.binder && getNodeSub(node.binder), node.primitives.map(getPrimSub))
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
