import {
  TreeState,
  NodeID,
  Substitutions,
  Tree,
  TreeNode,
  ReductionStage,
  REDUCTION_STAGES,
  searchTree,
  reduceTree,
  PrimitiveID,
  Primitives,
  NodeSubstitution,
  PrimitiveSubstitution
} from "board/state"
import _ from "lodash"
import { generateID } from "../util"
export interface LambdaReducer {
  name: string
  description: string
  useReduction: (tree: TreeState) => ReductionStage | undefined
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
  const substitutions = createSubstitutions(abs, consumed, tree)
  return {
    type: REDUCTION_STAGES[0],
    visibleParent: visibleParent,
    parentApplication: parentID,
    abs,
    child,
    consumed,
    substitutions,
    reducer: tree.reducer || ""
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
    .map((nodeID, index) =>
      index === -1
        ? {}
        : {
            [nodeID]: {
              nodes: createNodeSubstitution(consumedID, tree.nodes),
              primitives: createPrimitiveSubstitution(consumedID, tree.nodes)
            }
          }
    )
    .reduce((prev, cur) => ({ ...prev, ...cur }), {})
}

const createPrimitiveSubstitution = (consumedID: NodeID, tree: Tree): PrimitiveSubstitution => {
  const oldPrims = _.uniq(reduceTree(tree, (prims: string[], node) => [...prims, ...node.primitives], [], consumedID))
  const sub = oldPrims.reduce((sub, oldID) => ({ ...sub, [oldID]: generateID() }), {})
  return sub
}

const createNodeSubstitution = (nodeID: NodeID, tree: Tree): NodeSubstitution => {
  const node = tree[nodeID]
  if (!node) return {}
  return node.directChildren
    .map(nodeID => createNodeSubstitution(nodeID, tree))
    .reduce((subs, sub) => ({ ...subs, ...sub }), { [nodeID]: generateID() })
}

const getRemoved = (binderID: NodeID, tree: TreeState): NodeID[] =>
  _.keys(
    _.pickBy(tree.nodes, node => {
      return node.type === "VARIABLE" && node.binder(tree) === binderID
    })
  )
