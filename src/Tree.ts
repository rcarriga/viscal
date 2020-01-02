/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Coord } from "./state/coords/types"
import { DrawState } from "./state/draw/types"
import _ from "lodash"
export const VARIABLE = "VARIABLE"
export const ABSTRACTION = "ABSTRACTION"
export const APPLICATION = "APPLICATION"

type NodeID = string

interface Variable {
  type: typeof VARIABLE
  index: number
  name: string
}

interface Abstraction {
  type: typeof ABSTRACTION
  variableName: string
  child?: NodeID
}

interface Application {
  type: typeof APPLICATION
  left: NodeID
  right: NodeID
}

export type Expression = Variable | Abstraction | Application

export interface TreeNode {
  expr: Expression
  coord: Coord
  parentID?: NodeID
}

type Tree = { [nodeId: string]: TreeNode }

export interface TreeState {
  root?: NodeID
  nodes: Tree
}

const defaultCoord = () => {
  return { x: 0, y: 0, w: 0, h: 0 }
}

function variable(index: number, name: string, parentID?: NodeID): TreeNode {
  return {
    coord: defaultCoord(),
    parentID: parentID,
    expr: {
      type: VARIABLE,
      index: index,
      name: name
    }
  }
}

function abstraction(variableName: string, child?: string, parentID?: NodeID): TreeNode {
  return {
    coord: defaultCoord(),
    parentID: parentID,
    expr: {
      type: ABSTRACTION,
      variableName: variableName,
      child: child
    }
  }
}

function application(left: string, right: string, parentID?: NodeID): TreeNode {
  return {
    coord: defaultCoord(),
    parentID: parentID,
    expr: {
      type: APPLICATION,
      left: left,
      right: right
    }
  }
}
// (\b.b) a
export const testTree: TreeState = {
  root: "app1",
  nodes: {
    app1: application("abs1", "var1"),
    var1: variable(-1, "a", "app1"),
    abs1: abstraction("b", "var2", "app1"),
    var2: variable(0, "b", "abs1")
  }
}

const updateCoords = (children: string[], tree: Tree, draw: DrawState): Tree =>
  _.reduce(
    children,
    (tree, childID) => {
      return constructDimensions(childID, tree, draw)
    },
    tree
  )

export function constructCoords(tree: TreeState, draw: DrawState): TreeState {
  const root = tree.root
  if (!root) return tree
  return { root: root, nodes: populateCoords(root, constructDimensions(root, tree.nodes, draw), draw) }
}

function populateCoords(rootID: NodeID, tree: Tree, draw: DrawState, baseX: number = 50, baseY: number = 300): Tree {
  const root = tree[rootID]
  const newTree = {
    ...tree,
    [rootID]: {
      ...root,
      coord: {
        ...root.coord,
        x: baseX + draw.widthMargin,
        y: baseY
      }
    }
  }
  if (root.expr.type === VARIABLE) return newTree
  else {
    const children = getChildren(root)
    return _.reduce(
      children,
      (updatedTree, nodeID, index) => {
        const childBase = baseX + draw.widthMargin + (index > 0 ? tree[children[index - 1]].coord.w : 0)
        return populateCoords(nodeID, updatedTree, draw, childBase)
      },
      newTree
    )
  }
}

function constructDimensions(rootID: NodeID, tree: Tree, draw: DrawState): Tree {
  const root = tree[rootID]
  if (root.expr.type === VARIABLE)
    return {
      ...tree,
      [rootID]: {
        ...root,
        coord: {
          ...defaultCoord(),
          w: draw.circleRadius * 2,
          h: draw.circleRadius * 2
        }
      }
    }
  else {
    const children = getChildren(root)
    const updatedTree = updateCoords(children, tree, draw)
    return {
      ...updatedTree,
      [rootID]: {
        ...root,
        coord: {
          ...defaultCoord(),
          w: elementWidth(children, updatedTree, draw),
          h: elementsHeight(children, updatedTree, draw)
        }
      }
    }
  }
}

function getChildren(node: TreeNode): string[] {
  const expr = node.expr
  switch (expr.type) {
    case VARIABLE:
      return []
    case ABSTRACTION:
      return expr.child ? [expr.child] : []
    case APPLICATION:
      return [expr.left, expr.right]
    default:
      return []
  }
}

function elementWidth(children: string[], tree: Tree, draw: DrawState): number {
  return (
    _.reduce(children, (widthSum, childID) => tree[childID].coord.w + draw.widthMargin + widthSum, 0) + draw.widthMargin
  )
}

function elementsHeight(children: string[], tree: Tree, draw: DrawState): number {
  return (_.max(_.map(children, childID => tree[childID].coord.h)) || 0) + draw.heightMargin * 2
}
