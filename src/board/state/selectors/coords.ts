import _ from "lodash"
import { createSelector } from "reselect"
import { Dimensions, BoardState, NodeID, Tree, TreeNode, TreeState, Reduction } from ".."

export type Coords = { [nodeID: string]: NodeCoord }

export interface NodeCoord {
  readonly x: number
  readonly y: number
  readonly h: number
  readonly w: number
}

const constructCoords = (
  tree: TreeState,
  dimensions: Dimensions,
  reduction?: Reduction
): Coords => {
  const root = tree.root
  if (root) {
    const offsets = reduction ? calculateOffsets(tree.nodes, dimensions, reduction) : {}
    const withDimensions = addDimensions(root, tree.nodes, dimensions, offsets)
    return fillCoords(root, withDimensions, tree.nodes, dimensions, offsets)
  } else return {}
}

export const coordsSelector = createSelector(
  (state: BoardState) => state.tree,
  (state: BoardState) => state.visual.dimensions,
  (state: BoardState) => _.head(state.tree.reductions),
  constructCoords
)

const calculateOffsets = (tree: Tree, dimensions: Dimensions, reduction: Reduction): Coords => {
  const parentNode = tree[reduction.applicationID]
  const defaultOffset = { x: 0, y: 0, w: 0, h: 0 }
  if (parentNode) {
    const [absID, nodeID, ...remainingChildren] = parentNode.children(tree)
    if (absID && nodeID)
      switch (reduction.stage) {
        case "UNBIND":
        case "CONSUME": {
          const xOffset = -(dimensions.widthMargin + dimensions.circleRadius)
          const wOffset = -dimensions.widthMargin
          return {
            [reduction.applicationID]: {
              ...defaultOffset,
              w: wOffset
            },
            [nodeID]: {
              ...defaultOffset,
              x: xOffset
            },
            ..._.reduce(
              remainingChildren,
              (offsets, childID) => ({
                ...offsets,
                [childID]: {
                  ...defaultOffset,
                  x: xOffset
                }
              }),
              {}
            )
          }
        }
        default:
      }
  }
  return {}
}

const addOffset = (coord: NodeCoord, offset?: NodeCoord): NodeCoord =>
  offset
    ? {
        x: coord.x + offset.x,
        y: coord.y + offset.y,
        w: coord.w + offset.w,
        h: coord.h + offset.h
      }
    : coord

const fillCoords = (
  rootID: NodeID,
  coords: Coords,
  tree: Tree,
  dimensions: Dimensions,
  offsets: Coords,
  baseX: number = 0,
  baseY: number = 0
): Coords => {
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const coord = addOffset({ ...coords[rootID], x: baseX, y: baseY }, offsets[rootID])
    return _.reduce(
      children,
      (current, nodeID) => {
        return {
          baseX: current.baseX + current.coords[nodeID].w + dimensions.widthMargin,
          coords: fillCoords(
            nodeID,
            current.coords,
            tree,
            dimensions,
            offsets,
            current.baseX,
            baseY
          )
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
  offsets: Coords,
  coords: Coords = {}
): Coords => {
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const updated = _.reduce(
      children,
      (coords, childID) => addDimensions(childID, tree, dimensions, offsets, coords),
      coords
    )
    return {
      ...updated,
      [rootID]: addOffset(
        {
          h: elementHeight(root, updated, dimensions, tree),
          w: elementWidth(root, updated, dimensions, tree),
          x: 0,
          y: 0
        },
        offsets[rootID]
      )
    }
  }
  return coords
}

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
