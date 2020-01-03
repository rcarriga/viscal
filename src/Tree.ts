/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Coord } from "./state/coords/types"
import { DrawState } from "./state/draw/types"
import _ from "lodash"
export const VARIABLE = "VARIABLE"
export const ABSTRACTION = "ABSTRACTION"
export const APPLICATION = "APPLICATION"

type NodeID = string

interface BaseExpression {
  readonly children: string[]
}

interface Variable extends BaseExpression {
  readonly type: typeof VARIABLE
  readonly index: number
  readonly name: string
}

interface Abstraction extends BaseExpression {
  readonly type: typeof ABSTRACTION
  readonly variableName: string
}

interface Application extends BaseExpression {
  readonly type: typeof APPLICATION
  readonly left: NodeID
  readonly right: NodeID
}

export type Expression = Variable | Abstraction | Application

export interface TreeNode {
  readonly expr: Expression
  readonly coord: Coord
  readonly parentID?: NodeID
}

type Tree = { [nodeId: string]: TreeNode }

export interface TreeState {
  readonly root?: NodeID
  readonly nodes: Tree
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
      name: name,
      children: []
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
      children: child ? [child] : []
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
      right: right,
      children: [left, right]
    }
  }
}
// (\b.b) a
export const testTree: TreeState = {
  root: "app1",
  nodes: {
    app1: application("abs1", "var1"),
    var1: variable(-1, "a", "app1"),
    abs1: abstraction("b", "abs2", "app1"),
    abs2: abstraction("c", "var2", "abs1"),
    var2: variable(0, "b", "abs1")
  }
}

export function constructCoords(tree: TreeState, draw: DrawState): TreeState {
  const root = tree.root
  if (!root) return tree
  return {
    root: root,
    nodes: fillCoords(root, addDimensions(root, tree.nodes, draw), draw)
  }
}

function fillCoords(rootID: NodeID, tree: Tree, draw: DrawState, baseX = 50, baseY = 300): Tree {
  const root = tree[rootID]
  const newTree = {
    ...tree,
    [rootID]: {
      ...root,
      coord: {
        ...root.coord,
        x: baseX,
        y: baseY
      }
    }
  }
  switch (root.expr.type) {
    case VARIABLE:
      return newTree
    case ABSTRACTION: {
      const childBaseX = baseX + draw.circleRadius + draw.widthMargin
      return root.expr.children
        ? fillCoords(root.expr.children[0], newTree, draw, childBaseX, baseY)
        : newTree
    }
    case APPLICATION: {
      const leftBaseX = baseX + draw.circleRadius + draw.widthMargin
      const leftUpdate = fillCoords(root.expr.left, newTree, draw, leftBaseX, baseY)
      const rightBaseX = leftBaseX + leftUpdate[root.expr.left].coord.w + draw.widthMargin
      return fillCoords(root.expr.children[1], leftUpdate, draw, rightBaseX, baseY)
    }
    default:
      return newTree
  }
}

function addDimensions(rootID: NodeID, tree: Tree, draw: DrawState): Tree {
  const root = tree[rootID]
  const children = root.expr.children
  const updated = _.reduce(children, (tree, childID) => addDimensions(childID, tree, draw), tree)
  return {
    ...updated,
    [rootID]: {
      ...root,
      coord: {
        ...defaultCoord(),
        w: elementWidth(root, updated, draw),
        h: elementsHeight(root, updated, draw)
      }
    }
  }
}

function elementWidth(node: TreeNode, tree: Tree, draw: DrawState): number {
  const sumChildren = () =>
    _.reduce(
      node.expr.children,
      (widthSum, childID) => tree[childID].coord.w + draw.widthMargin + widthSum,
      0
    )

  switch (node.expr.type) {
    case VARIABLE:
      return draw.circleRadius * 2
    case ABSTRACTION:
      return sumChildren() + draw.circleRadius * 2 + draw.widthMargin
    case APPLICATION:
      return sumChildren() + draw.circleRadius
    default:
      return 0
  }
}

function elementsHeight(node: TreeNode, tree: Tree, draw: DrawState): number {
  const maxChildren = () =>
    _.max(_.map(node.expr.children, childID => tree[childID].coord.h)) || draw.heightMargin * 2

  switch (node.expr.type) {
    case VARIABLE:
      return draw.circleRadius * 2
    case ABSTRACTION:
      return maxChildren() + draw.circleRadius
    case APPLICATION:
      return maxChildren() + draw.circleRadius
    default:
      return 0
  }
}
