import _ from "lodash"
import { createSelector } from "reselect"
import { Dimensions, BoardState, NodeID, Tree, TreeNode, TreeState } from ".."

export type Coords = { [nodeID: string]: Coord }

export interface Coord {
  readonly x: number
  readonly y: number
  readonly h: number
  readonly w: number
}

const constructCoords = (tree: TreeState, dimensions: Dimensions): Coords => {
  const root = tree.root
  if (root) {
    const withDimensions = addDimensions(root, tree.nodes, dimensions)
    const coords = fillCoords(root, withDimensions, tree.nodes, dimensions)
    console.log(coords)
    return coords
  } else return {}
}

/**
 * Retrieve the coordinates for nodes based on the given state.
 * @return {Coords} Coords object containing coordinates for all nodes from the root down.
 */
export const coordsSelector = createSelector(
  (state: BoardState) => state.tree,
  (state: BoardState) => state.visual.dimensions,
  constructCoords
)

const getNode = (nodeID: NodeID, tree: Tree): TreeNode => {
  return tree[nodeID] || { type: "NULL" }
}

/**
 * Fill a coords object with the x and y values for each node,
 * based on existing width and height values.
 *
 * @function fillCoords
 * @param {NodeID} rootID - Node to begin calculations from.
 * @param {Coords} coords - Coords object with width and height values for all nodes.
 * @param {Tree} tree - Tree to retrieve nodes from.
 * @param {Dimensions} dimensions - Dimensions object from state.
 * @param {number} baseX - X value to begin root at.
 * @param {number} baseY - Y value to begin root at.
 * @return {Coords} Coord object containing coordinates for all nodes from the root down.
 */
const fillCoords = (
  rootID: NodeID,
  coords: Coords,
  tree: Tree,
  dimensions: Dimensions,
  baseX: number = 0,
  baseY: number = 0
): Coords => {
  const root = getNode(rootID, tree)
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

/**
 * Calculate the width and height dimensions for all nodes in the given tree from the root down.
 *
 * @function addDimensions
 * @param {NodeID} rootID - Node to start calculating from.
 * @param {Tree} tree - Tree to retrieve nodes from.
 * @param {Dimensions} dimensions - Dimensions object from state
 * @param {Coords} coords - Coords object to pass around internally to track finished calculations.
 * @return {Coords} Coords object with width and height values filled in.
 */
const addDimensions = (
  rootID: NodeID,
  tree: Tree,
  dimensions: Dimensions,
  coords: Coords = {}
): Coords => {
  const root = getNode(rootID, tree)
  const children = root.children
  const updated = _.reduce(
    children,
    (coords, childID) => addDimensions(childID, tree, dimensions, coords),
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

/**
 * Calculates the width of a node by based on children and its dimensions.
 *
 * @function elementWidth
 * @param {TreeNode} node - Node to calculate for
 * @param {Coords} coords - Coords object with node dimensions filled in
 * @param {Dimensions} dimensions - Dimensions object from state
 * @return {number} Width of node in pixels
 */
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
      return sumChildren() + dimensions.circleRadius + dimensions.widthMargin
    default:
      return 0
  }
}

/**
 * Calculates the height of a node based on its children and dimensions.
 *
 * @function elementHeight
 * @param {TreeNode} node - Node to calculate for
 * @param {Coords} coords - Coords object with node dimensions filled in
 * @param {Dimensions} dimensions - Dimensions object from state
 * @return {number} Height in pixels
 */
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
