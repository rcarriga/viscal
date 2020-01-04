import _ from "lodash"
import { combineReducers } from "redux"
import { BoardState, Coords, BoardAction } from "./types"
import { TreeState, Tree, TreeNode, NodeID, VARIABLE, ABSTRACTION, APPLICATION } from "./tree/types"
import { initialTreeState, tree } from "./tree/reducers"
import { DrawState } from "./draw/types"
import { initialDrawState, draw } from "./draw/reducers"

const initialState = {
  tree: initialTreeState,
  draw: initialDrawState,
  coords: {}
}

export function board(state = initialState, action: BoardAction): BoardState {
  const updated: { tree: TreeState; draw: DrawState } = combineReducers({ draw, tree })(
    state,
    action
  )
  return {
    ...updated,
    coords: updated.tree.root
      ? constructCoords(updated.tree.root, updated.tree.nodes, updated.draw)
      : {}
  }
}

function constructCoords(root: NodeID, tree: Tree, draw: DrawState): Coords {
  return fillCoords(root, addDimensions(root, {}, tree, draw), tree, draw)
}

function fillCoords(
  rootID: NodeID,
  coords: Coords,
  tree: Tree,
  draw: DrawState,
  baseX = draw.startX,
  baseY = draw.startY
): Coords {
  const root = tree[rootID]
  const newCoords = { ...coords, [rootID]: { ...coords[rootID], x: baseX, y: baseY } }
  switch (root.expr.type) {
    case VARIABLE:
      return newCoords
    case ABSTRACTION: {
      const childBaseX = baseX + draw.circleRadius + draw.widthMargin
      return root.expr.children
        ? fillCoords(root.expr.children[0], newCoords, tree, draw, childBaseX, baseY)
        : newCoords
    }
    case APPLICATION: {
      const leftBaseX = baseX + draw.circleRadius + draw.widthMargin
      const leftUpdate = fillCoords(root.expr.left, newCoords, tree, draw, leftBaseX, baseY)
      const rightBaseX = leftBaseX + leftUpdate[root.expr.left].w + draw.widthMargin
      return fillCoords(root.expr.children[1], leftUpdate, tree, draw, rightBaseX, baseY)
    }
    default:
      return newCoords
  }
}

function addDimensions(rootID: NodeID, coords: Coords, tree: Tree, draw: DrawState): Coords {
  const root = tree[rootID]
  const children = root.expr.children
  const updated = _.reduce(
    children,
    (coords, childID) => addDimensions(childID, coords, tree, draw),
    coords
  )
  return {
    ...updated,
    [rootID]: {
      x: 0,
      y: 0,
      w: elementWidth(root, updated, draw),
      h: elementHeight(root, updated, draw)
    }
  }
}

function elementWidth(node: TreeNode, coords: Coords, draw: DrawState): number {
  const sumChildren = () =>
    _.reduce(
      node.expr.children,
      (widthSum, childID) => coords[childID].w + draw.widthMargin + widthSum,
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

function elementHeight(node: TreeNode, coords: Coords, draw: DrawState): number {
  const maxChildren = () =>
    _.max(_.map(node.expr.children, childID => coords[childID].h)) || draw.heightMargin * 2

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