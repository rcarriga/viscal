import _ from "lodash"
import { BoardState, CoordState } from "./types"
import { BoardAction } from "./actions"
import { Tree, TreeNode, NodeID, VARIABLE, ABSTRACTION, APPLICATION } from "./tree"
import { initialTreeState, tree } from "./tree/reducers"
import { ControlState } from "./control"
import { initialControlState, control } from "./control/reducers"

const initialState = {
  control: initialControlState,
  coords: {},
  tree: initialTreeState
}

export function board(state = initialState, action: BoardAction): BoardState {
  const newTree = tree(state.tree, action)
  const newcontrol = control(state.control, action)
  return {
    control: newcontrol,
    coords: newTree.root ? constructCoords(newTree.root, newTree.nodes, newcontrol) : {},
    tree: newTree
  }
}

function constructCoords(root: NodeID, tree: Tree, control: ControlState): CoordState {
  return fillCoords(root, addDimensions(root, {}, tree, control), tree, control)
}

function fillCoords(
  rootID: NodeID,
  coords: CoordState,
  tree: Tree,
  control: ControlState,
  baseX = control.startX,
  baseY = control.startY
): CoordState {
  const root = tree[rootID]
  const newCoords = { ...coords, [rootID]: { ...coords[rootID], x: baseX, y: baseY } }
  switch (root.expr.type) {
    case VARIABLE:
      return newCoords
    case ABSTRACTION: {
      const childBaseX = baseX + control.circleRadius + control.widthMargin
      return root.expr.children
        ? fillCoords(root.expr.children[0], newCoords, tree, control, childBaseX, baseY)
        : newCoords
    }
    case APPLICATION: {
      const leftBaseX = baseX + control.circleRadius + control.widthMargin
      const leftUpdate = fillCoords(root.expr.left, newCoords, tree, control, leftBaseX, baseY)
      const rightBaseX = leftBaseX + leftUpdate[root.expr.left].w + control.widthMargin
      return fillCoords(root.expr.children[1], leftUpdate, tree, control, rightBaseX, baseY)
    }
    default:
      return newCoords
  }
}

function addDimensions(
  rootID: NodeID,
  coords: CoordState,
  tree: Tree,
  control: ControlState
): CoordState {
  const root = tree[rootID]
  const children = root.expr.children
  const updated = _.reduce(
    children,
    (coords, childID) => addDimensions(childID, coords, tree, control),
    coords
  )
  return {
    ...updated,
    [rootID]: {
      h: elementHeight(root, updated, control),
      w: elementWidth(root, updated, control),
      x: 0,
      y: 0
    }
  }
}

function elementWidth(node: TreeNode, coords: CoordState, control: ControlState): number {
  const sumChildren = () =>
    _.reduce(
      node.expr.children,
      (widthSum, childID) => coords[childID].w + control.widthMargin + widthSum,
      0
    )

  switch (node.expr.type) {
    case VARIABLE:
      return control.circleRadius * 2
    case ABSTRACTION:
      return sumChildren() + control.circleRadius * 2 + control.widthMargin
    case APPLICATION:
      return sumChildren() + control.circleRadius
    default:
      return 0
  }
}

function elementHeight(node: TreeNode, coords: CoordState, control: ControlState): number {
  const maxChildren = () =>
    _.max(_.map(node.expr.children, childID => coords[childID].h)) || control.heightMargin * 2

  switch (node.expr.type) {
    case VARIABLE:
      return control.circleRadius * 2
    case ABSTRACTION:
      return maxChildren() + control.circleRadius
    case APPLICATION:
      return maxChildren() + control.circleRadius
    default:
      return 0
  }
}
