import { createSelector } from "reselect"
import { DimensionSettings, BoardState, NodeID, Tree, TreeState, ReductionStage } from "../.."
import { generateID } from "../../../content/util"
import { getDimensions } from "./dimensions"
import { Coords, CoordOffsets, NodeCoord, CoordOffset, NodeDimensions } from "./types"

export * from "./types"

const constructCoords = (tree: TreeState, settings: DimensionSettings): Coords => {
  const root = tree.root
  if (root) {
    const dimensions = getDimensions(root, tree.nodes, settings, tree.reduction)
    const coordOffsets = tree.reduction ? calculateCoordOffsets(tree.nodes, settings, tree.reduction) : {}
    return fillCoords(root, dimensions, tree.nodes, settings, coordOffsets)
  } else return {}
}

export const coordsSelector = createSelector(
  (state: BoardState) => state.tree,
  (state: BoardState) => state.visual.dimensions,
  (state: BoardState) => state.tree.reduction,
  constructCoords
)

const calculateCoordOffsets = (tree: Tree, settings: DimensionSettings, reduction: ReductionStage): CoordOffsets => {
  const parentNode = tree[reduction.parent]
  if (parentNode) {
    const [absID, nodeID] = parentNode.children(tree)
    if (absID && nodeID) {
      const xOffset = -(settings.widthMargin + settings.circleRadius)
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

const fillCoords = (
  rootID: NodeID,
  dimensions: NodeDimensions,
  tree: Tree,
  settings: DimensionSettings,
  offsets: CoordOffsets,
  coordID = generateID(),
  baseX: number = 0,
  baseY: number = 0
): Coords => {
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const coord = addOffset({ nodeID: rootID, ...dimensions[rootID], x: baseX, y: baseY }, offsets[rootID])
    return children.reduce(
      (current, nodeID) => {
        const childID = generateID()
        const childCoord = fillCoords(nodeID, dimensions, tree, settings, offsets, childID, current.baseX, baseY)
        return {
          baseX: childCoord[childID].x + childCoord[childID].w + settings.widthMargin,
          coords: { ...childCoord, ...current.coords }
        }
      },
      {
        baseX: coord.x + settings.circleRadius + settings.widthMargin,
        coords: {
          [coordID]: coord
        }
      }
    ).coords
  }
  return {}
}

const addOffset = (coord: NodeCoord, offset?: CoordOffset): NodeCoord =>
  offset
    ? {
        ...coord,
        x: coord.x + (offset.x || 0),
        y: coord.y + (offset.y || 0)
      }
    : coord

