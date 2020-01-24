import { createSelector } from "reselect"
import { DimensionSettings, BoardState, NodeID, Tree, TreeState, ReductionStage } from "../.."
import { getDimensions } from "./dimensions"
import { Coords, CoordOffsets, NodeCoord, CoordOffset, NodeDimensions } from "./types"

export * from "./types"

const constructCoords = (tree: TreeState, settings: DimensionSettings): Coords => {
  const root = tree.root
  if (root) {
    const dimensions = getDimensions(root, tree.nodes, settings, tree.reduction)
    const coordOffsets = tree.reduction ? calculateCoordOffsets(settings, tree.reduction) : {}

    const coords = fillCoords(root, dimensions, tree.nodes, settings, coordOffsets)
    return tree.reduction ? moveSubstitutions(coords, tree.reduction, tree) : coords
  } else return {}
}

export const coordsSelector = createSelector(
  (state: BoardState) => state.tree,
  (state: BoardState) => state.visual.dimensions,
  (state: BoardState) => state.tree.reduction,
  constructCoords
)

const moveSubstitutions = (coords: Coords, reduction: ReductionStage, tree: TreeState): Coords => {
  switch (reduction.type) {
    case "UNBIND":
      return Object.keys(reduction.substitutions).reduce((coords, substitutionKey) => {
        const substitution = reduction.substitutions[substitutionKey]
        return Object.keys(substitution).reduce((coords, replaced) => {
          const replacement = substitution[replaced]
          return { ...coords, [replacement]: { ...coords[replaced], nodeID: replacement } }
        }, coords)
      }, coords)
    default:
      return coords
  }
}

const calculateCoordOffsets = (settings: DimensionSettings, reduction: ReductionStage): CoordOffsets => {
  const xOffset = -(settings.widthMargin + settings.circleRadius)
  switch (reduction.type) {
    case "APPLY":
      return {
        [reduction.abs]: {
          x: xOffset
        },
        [reduction.child]: {
          x: -xOffset
        }
      }
    case "CONSUME":
    case "UNBIND":
    case "SUBSTITUTE":
      return {
        [reduction.abs]: {
          x: xOffset
        },
        [reduction.child]: {
          x: -xOffset
        },
        [reduction.consumed]: {
          x: xOffset
        }
      }
    default:
      return {}
  }
}

const fillCoords = (
  rootID: NodeID,
  dimensions: NodeDimensions,
  tree: Tree,
  settings: DimensionSettings,
  offsets: CoordOffsets,
  coordID = rootID,
  baseX: number = 0,
  baseY: number = 0
): Coords => {
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const coord = addOffset({ nodeID: rootID, ...dimensions[rootID], x: baseX, y: baseY }, offsets[rootID])
    return children.reduce(
      (current, nodeID) => {
        const childID = nodeID
        const childCoord = fillCoords(nodeID, dimensions, tree, settings, offsets, childID, current.baseX, baseY)
        return {
          baseX: childCoord[childID].x + childCoord[childID].w + settings.widthMargin,
          coords: { ...current.coords, ...childCoord }
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
