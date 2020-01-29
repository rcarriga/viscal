import { createSelector } from "reselect"
import { DimensionSettings, BoardState, NodeID, Tree, TreeState, ReductionStage } from "../.."
import { getDimensions } from "./dimensions"
import { Coords, CoordOffsets, NodeCoord, CoordOffset, NodeDimensions } from "./types"

export * from "./types"

const constructCoords = (tree: TreeState, settings: DimensionSettings): Coords => {
  const root = tree.root
  if (root) {
    const dimensions = getDimensions(tree, settings, tree.reduction)
    const coordOffsets = tree.reduction ? calculateCoordOffsets(settings, tree.reduction, tree) : {}

    const coords = fillCoords(root, dimensions, tree.nodes, settings, coordOffsets)
    return tree.reduction ? moveReplacements(coords, tree.reduction, settings) : coords
  } else return {}
}

export const coordsSelector = createSelector(
  (state: BoardState) => state.tree,
  (state: BoardState) => state.visual.dimensions,
  (state: BoardState) => state.tree.reduction,
  constructCoords
)

const moveReplacements = (coords: Coords, reduction: ReductionStage, settings: DimensionSettings): Coords => {
  return Object.keys(reduction.substitutions).reduce((coords, unbindedVar) => {
    const substitution = reduction.substitutions[unbindedVar]
    return Object.keys(substitution).reduce((coords, renamedTerm) => {
      const replacement = substitution[renamedTerm]
      if (coords[renamedTerm]) {
        const yOffset = settings.heightMargin * 2 + settings.circleRadius * 4
        switch (reduction.type) {
          case "CONSUME":
            return {
              ...coords,
              [replacement]: {
                ...coords[renamedTerm],
                nodeID: replacement
              }
            }
          case "LIFT":
            return {
              ...coords,
              [replacement]: {
                ...coords[renamedTerm],
                y: coords[renamedTerm].y - yOffset,
                nodeID: replacement
              }
            }
          case "HOVER":
          case "UNBIND":
            return {
              ...coords,
              [replacement]: {
                ...coords[renamedTerm],
                y: coords[renamedTerm].y - yOffset,
                x: coords[unbindedVar].x - (coords[reduction.consumed].x - coords[renamedTerm].x),
                nodeID: replacement
              }
            }
          default:
            return coords
        }
      }
      return coords
    }, coords)
  }, coords)
}

const calculateCoordOffsets = (
  settings: DimensionSettings,
  reduction: ReductionStage,
  state: TreeState
): CoordOffsets => {
  const xOffset = settings.widthMargin + settings.circleRadius
  switch (reduction.type) {
    case "CONSUME":
      return {
        [reduction.consumed]: { x: -xOffset }
      }
    case "LIFT":
    case "HOVER":
    case "UNBIND":
      return { [reduction.consumed]: { x: -xOffset } }
    case "SUBSTITUTE":
      return {
        [reduction.consumed]: {
          x: -xOffset
        }
      }
    case "SHIFT": {
      const newChild = state.nodes[reduction.abs].directChildren[0]
      return {
        [reduction.consumed]: {
          x: -xOffset
        },
        [newChild]: {
          x: -xOffset
        },
        [reduction.abs]: {
          x: reduction.visibleParent === reduction.parentApplication ? -xOffset : 0
        }
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
  baseX: number = 0,
  baseY: number = 0
): Coords => {
  const root = tree[rootID]
  if (root) {
    const coord = addOffset({ nodeID: rootID, ...dimensions[rootID], x: baseX, y: baseY }, offsets[rootID])
    return root.children(tree).reduce(
      (current, nodeID) => {
        const childCoord = fillCoords(nodeID, dimensions, tree, settings, offsets, current.baseX, baseY)
        return {
          baseX: childCoord[nodeID].x + childCoord[nodeID].w + settings.widthMargin,
          coords: { ...current.coords, ...childCoord }
        }
      },
      {
        baseX: coord.x + settings.circleRadius + settings.widthMargin,
        coords: {
          [rootID]: coord
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
