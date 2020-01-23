import { createSelector } from "reselect"
import { Dimensions, BoardState, NodeID, Tree, TreeNode, TreeState, ReductionStage } from ".."

export type Coords = { [coordID: string]: NodeCoord }

export interface NodeCoord {
  readonly nodeID: NodeID
  readonly x: number
  readonly y: number
  readonly h: number
  readonly w: number
}

const constructCoords = (tree: TreeState, dimensions: Dimensions, reduction?: ReductionStage): Coords => {
  const root = tree.root
  if (root) {
    const dimensionOffsets = reduction ? calculateDimensionOffsets(tree.nodes, dimensions, reduction) : {}
    const withDimensions = addDimensions(root, tree.nodes, dimensions, dimensionOffsets)
    const coordOffsets = reduction ? calculateCoordOffsets(tree.nodes, dimensions, reduction) : {}
    return fillCoords(root, withDimensions, tree.nodes, dimensions, coordOffsets)
  } else return {}
}

export const coordsSelector = createSelector(
  (state: BoardState) => state.tree,
  (state: BoardState) => state.visual.dimensions,
  (state: BoardState) => state.tree.reduction,
  constructCoords
)

type Offset = { [key in keyof NodeCoord]?: number }
type Offsets = { [nodeID in NodeID]: Offset }

const calculateCoordOffsets = (tree: Tree, dimensions: Dimensions, reduction: ReductionStage): Offsets => {
  const parentNode = tree[reduction.parent]
  if (parentNode) {
    const [absID, nodeID] = parentNode.children(tree)
    if (absID && nodeID) {
      const xOffset = -(dimensions.widthMargin + dimensions.circleRadius)
      switch (reduction.type) {
        case "APPLY":
          return {
            [absID]: {
              x: xOffset
            }
          }
        case "CONSUME":
          return {
            [absID]: {
              x: xOffset
            },
            [nodeID]: {
              x: xOffset
            }
          }
        default:
          return {}
      }
    }
  }
  return {}
}

const calculateDimensionOffsets = (tree: Tree, dimensions: Dimensions, reduction: ReductionStage): Offsets => {
  const parentNode = tree[reduction.parent]
  if (parentNode) {
    const [absID, nodeID] = parentNode.children(tree)
    if (absID && nodeID) {
      const wOffset = dimensions.circleRadius + dimensions.widthMargin
      switch (reduction.type) {
        case "APPLY":
          return {
            [absID]: {
              w: wOffset
            },
            [reduction.parent]: { w: -wOffset }
          }
        case "CONSUME":
          return {
            [absID]: {
              w: wOffset
            },
            [reduction.parent]: { w: -2 * wOffset }
          }
        default:
          return {}
      }
    }
  }
  return {}
}

const addOffset = (coord: NodeCoord, offset?: Offset): NodeCoord =>
  offset
    ? {
        nodeID: coord.nodeID,
        x: coord.x + (offset.x || 0),
        y: coord.y + (offset.y || 0),
        w: coord.w + (offset.w || 0),
        h: coord.h + (offset.h || 0)
      }
    : coord

const fillCoords = (
  rootID: NodeID,
  coords: Coords,
  tree: Tree,
  dimensions: Dimensions,
  offsets: Offsets,
  baseX: number = 0,
  baseY: number = 0
): Coords => {
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const coord = addOffset({ ...coords[rootID], x: baseX, y: baseY }, offsets[rootID])
    return children.reduce(
      (current, nodeID) => {
        const updatedCoords = fillCoords(nodeID, current.coords, tree, dimensions, offsets, current.baseX, baseY)
        return {
          baseX: updatedCoords[nodeID].x + updatedCoords[nodeID].w + dimensions.widthMargin,
          coords: updatedCoords
        }
      },
      {
        baseX: coord.x + dimensions.circleRadius + dimensions.widthMargin,
        coords: {
          ...coords,
          [rootID]: coord
        }
      }
    ).coords
  }
  return coords
}

const addDimensions = (
  rootID: NodeID,
  tree: Tree,
  dimensions: Dimensions,
  offsets: Offsets,
  coords: Coords = {}
): Coords => {
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const childDimensions = children
      .map(childID => addDimensions(childID, tree, dimensions, offsets, coords))
      .reduce((prev, cur) => ({ ...prev, ...cur }), {})
    return {
      ...childDimensions,
      [rootID]: addOffset(
        {
          nodeID: rootID,
          h: elementHeight(root, childDimensions, dimensions, tree),
          w: elementWidth(root, childDimensions, dimensions, tree),
          x: 0,
          y: 0
        },
        offsets[rootID]
      )
    }
  }
  return coords
}

const elementWidth = (node: TreeNode, coords: Coords, dimensions: Dimensions, tree: Tree): number => {
  const sumChildren = () =>
    node
      .children(tree)
      .map(childID => (tree[childID] ? coords[childID].w : -dimensions.widthMargin))
      .reduce((sum, w) => sum + w + dimensions.widthMargin, 0)

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

const elementHeight = (node: TreeNode, coords: Coords, dimensions: Dimensions, tree: Tree): number => {
  const maxChildren = () =>
    Math.max(...node.children(tree).map(childID => coords[childID].h)) || dimensions.circleRadius * 2

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
