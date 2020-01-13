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
    return fillCoords(root, withDimensions, tree.nodes, dimensions)
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
): Coords =>
  _.reduce(
    (tree[rootID] || { children: () => [] }).children(tree),
    (current, nodeID) => ({
      baseX: current.baseX + current.coords[nodeID].w + dimensions.widthMargin,
      coords: fillCoords(nodeID, current.coords, tree, dimensions, current.baseX, baseY)
    }),
    {
      baseX: baseX + dimensions.circleRadius + dimensions.widthMargin,
      coords: { ...coords, [rootID]: { ...coords[rootID], x: baseX, y: baseY } }
    }
  ).coords

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
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const updated = _.reduce(
      children,
      (coords, childID) => addDimensions(childID, tree, dimensions, coords),
      coords
    )
    return {
      ...updated,
      [rootID]: {
        h: elementHeight(root, updated, dimensions, tree),
        w: elementWidth(root, updated, dimensions, tree),
        x: 0,
        y: 0
      }
    }
  }
  return coords
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
const elementWidth = (
  node: TreeNode,
  coords: Coords,
  dimensions: Dimensions,
  tree: Tree
): number => {
  const sumChildren = () =>
    _.sumBy(
      _.map(node.children(tree), childID =>
        tree[childID] ? coords[childID].w : -dimensions.widthMargin
      ),
      w => w + dimensions.widthMargin
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
const elementHeight = (
  node: TreeNode,
  coords: Coords,
  dimensions: Dimensions,
  tree: Tree
): number => {
  const maxChildren = () =>
    _.max(_.map(node.children(tree), childID => coords[childID].h)) || dimensions.circleRadius * 2

  switch (node.type) {
    case "VARIABLE":
      return dimensions.circleRadius * 2
    case "ABSTRACTION":
      return maxChildren() + dimensions.heightMargin * 2
    case "APPLICATION":
      return maxChildren() + dimensions.heightMargin * 2
    default:
      return 0
  }
}

