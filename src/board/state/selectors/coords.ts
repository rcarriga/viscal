import _ from "lodash"
import { createSelector } from "reselect"
import { VisualState, BoardState, NodeID, Tree, TreeNode, TreeState } from ".."

export type Coords = { [nodeID: string]: Coord }

export interface Coord {
  readonly x: number
  readonly y: number
  readonly h: number
  readonly w: number
}

export const coordsSelector = createSelector(
  (state: BoardState) => state.tree,
  (state: BoardState) => state.visual,
  constructCoords
)

function constructCoords(tree: TreeState, visual: VisualState): Coords {
  const root = tree.root
  if (root) {
    const withDimensions = addDimensions(root, {}, tree.nodes, visual)
    return fillCoords(root, withDimensions, tree.nodes, visual)
  } else return {}
}

function fillCoords(
  rootID: NodeID,
  coords: Coords,
  tree: Tree,
  visual: VisualState,
  baseX = visual.treeLayout.startX,
  baseY = visual.treeLayout.startY
): Coords {
  const root = tree[rootID]
  const newCoords = { ...coords, [rootID]: { ...coords[rootID], x: baseX, y: baseY } }
  switch (root.type) {
    case "VARIABLE":
      return newCoords
    case "ABSTRACTION": {
      const childBaseX = baseX + visual.dimensions.circleRadius + visual.dimensions.widthMargin
      return root.children
        ? fillCoords(root.children[0], newCoords, tree, visual, childBaseX, baseY)
        : newCoords
    }
    case "APPLICATION": {
      const leftBaseX = baseX + visual.dimensions.circleRadius + visual.dimensions.widthMargin
      const leftUpdate = fillCoords(root.left, newCoords, tree, visual, leftBaseX, baseY)
      const rightBaseX = leftBaseX + leftUpdate[root.left].w + visual.dimensions.widthMargin
      return fillCoords(root.children[1], leftUpdate, tree, visual, rightBaseX, baseY)
    }
    default:
      return newCoords
  }
}

function addDimensions(rootID: NodeID, coords: Coords, tree: Tree, control: VisualState): Coords {
  const root = tree[rootID]
  const children = root.children
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

function elementWidth(node: TreeNode, coords: Coords, visual: VisualState): number {
  const sumChildren = () =>
    _.reduce(
      node.children,
      (widthSum, childID) => coords[childID].w + visual.dimensions.widthMargin + widthSum,
      0
    )

  switch (node.type) {
    case "VARIABLE":
      return visual.dimensions.circleRadius * 2
    case "ABSTRACTION":
      return sumChildren() + visual.dimensions.circleRadius * 2 + visual.dimensions.widthMargin
    case "APPLICATION":
      return sumChildren() + visual.dimensions.circleRadius
    default:
      return 0
  }
}

function elementHeight(node: TreeNode, coords: Coords, visual: VisualState): number {
  const maxChildren = () =>
    _.max(_.map(node.children, childID => coords[childID].h)) || visual.dimensions.heightMargin * 2

  switch (node.type) {
    case "VARIABLE":
      return visual.dimensions.circleRadius * 2
    case "ABSTRACTION":
      return maxChildren() + visual.dimensions.circleRadius
    case "APPLICATION":
      return maxChildren() + visual.dimensions.circleRadius
    default:
      return 0
  }
}
