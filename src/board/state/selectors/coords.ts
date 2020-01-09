import _ from "lodash"
import { createSelector } from "reselect"
import { Dimensions, Layout, BoardState, NodeID, Tree, TreeNode, TreeState } from ".."

export type Coords = { [nodeID: string]: Coord }

export interface Coord {
  readonly x: number
  readonly y: number
  readonly h: number
  readonly w: number
}

const constructCoords = (tree: TreeState, dimensions: Dimensions, layout: Layout): Coords => {
  console.log("hello world")
  const root = tree.root
  if (root) {
    const withDimensions = addDimensions(root, {}, tree.nodes, dimensions)
    return fillCoords(root, withDimensions, tree.nodes, dimensions, layout.startX, layout.startY)
  } else return {}
}

export const coordsSelector = createSelector(
  (state: BoardState) => state.tree,
  (state: BoardState) => state.visual.dimensions,
  (state: BoardState) => state.visual.treeLayout,
  constructCoords
)

const fillCoords = (
  rootID: NodeID,
  coords: Coords,
  tree: Tree,
  dimensions: Dimensions,
  baseX: number,
  baseY: number
): Coords => {
  const root = tree[rootID]
  const newCoords = { ...coords, [rootID]: { ...coords[rootID], x: baseX, y: baseY } }
  switch (root.type) {
    case "VARIABLE":
      return newCoords
    case "ABSTRACTION": {
      const childBaseX = baseX + dimensions.circleRadius + dimensions.widthMargin
      return root.children
        ? fillCoords(root.children[0], newCoords, tree, dimensions, childBaseX, baseY)
        : newCoords
    }
    case "APPLICATION": {
      const leftBaseX = baseX + dimensions.circleRadius + dimensions.widthMargin
      const leftUpdate = fillCoords(root.left, newCoords, tree, dimensions, leftBaseX, baseY)
      const rightBaseX = leftBaseX + leftUpdate[root.left].w + dimensions.widthMargin
      return fillCoords(root.children[1], leftUpdate, tree, dimensions, rightBaseX, baseY)
    }
    default:
      return newCoords
  }
}

const addDimensions = (
  rootID: NodeID,
  coords: Coords,
  tree: Tree,
  dimensions: Dimensions
): Coords => {
  const root = tree[rootID]
  const children = root.children
  const updated = _.reduce(
    children,
    (coords, childID) => addDimensions(childID, coords, tree, dimensions),
    coords
  )
  return {
    ...updated,
    [rootID]: {
      h: elementHeight(root, updated, dimensions),
      w: elementWidth(root, updated, dimensions),
      x: 0,
      y: 0
    }
  }
}

const elementWidth = (node: TreeNode, coords: Coords, dimensions: Dimensions): number => {
  const sumChildren = () =>
    _.reduce(
      node.children,
      (widthSum, childID) => coords[childID].w + dimensions.widthMargin + widthSum,
      0
    )

  switch (node.type) {
    case "VARIABLE":
      return dimensions.circleRadius * 2
    case "ABSTRACTION":
      return sumChildren() + dimensions.circleRadius * 2 + dimensions.widthMargin
    case "APPLICATION":
      return sumChildren() + dimensions.circleRadius
    default:
      return 0
  }
}

const elementHeight = (node: TreeNode, coords: Coords, dimensions: Dimensions): number => {
  const maxChildren = () =>
    _.max(_.map(node.children, childID => coords[childID].h)) || dimensions.heightMargin * 2

  switch (node.type) {
    case "VARIABLE":
      return dimensions.circleRadius * 2
    case "ABSTRACTION":
      return maxChildren() + dimensions.circleRadius
    case "APPLICATION":
      return maxChildren() + dimensions.circleRadius
    default:
      return 0
  }
}
