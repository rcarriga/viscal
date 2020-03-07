import {
  DimensionSettings,
  BoardState,
  NodeID,
  Tree,
  TreeState,
  ReductionStage,
  joinsSelector,
  NodeJoins
} from "board/state"
import _ from "lodash"
import { createSelector } from "reselect"
import { constructDimensions } from "./dimensions"
import { Coords, CoordOffsets, NodeCoord, CoordOffset, NodeDimensions } from "./types"

export * from "./types"

const constructCoords = (tree: TreeState, settings: DimensionSettings, joins: NodeJoins): Coords => {
  const root = tree.root
  if (root) {
    const dimensions = constructDimensions(tree, settings, joins)
    const coordOffsets = calculateCoordOffsets(settings, joins, tree)

    const coords = fillCoords(root, dimensions, tree.nodes, settings, coordOffsets)
    const afterReduction = tree.reduction ? addOverrides(coords, tree, tree.reduction, settings) : coords
    if (tree.nodes[root].type === "APPLICATION") delete afterReduction[root]
    return afterReduction
  } else return {}
}

export const coordsSelector = createSelector(
  (state: BoardState) => state.tree.present,
  (state: BoardState) => state.visual.dimensions,
  (state: BoardState) => joinsSelector(state),
  constructCoords
)

const addOverrides = (
  coords: Coords,
  state: TreeState,
  reduction: ReductionStage,
  settings: DimensionSettings
): Coords => {
  const replacementOverrides = _.reduce(
    reduction.substitutions,
    (coords, substitution, unbindedVar) =>
      _.reduce(
        substitution.nodes,
        (coords, replacement, toReplace) => {
          if (coords[toReplace]) {
            const yOffset = settings.heightMargin * 2 + settings.circleRadius * 4
            switch (reduction.type) {
              case "CONSUME":
                return {
                  ...coords,
                  [replacement]: {
                    ...coords[toReplace],
                    nodeID: replacement
                  }
                }
              case "LIFT":
                return {
                  ...coords,
                  [replacement]: {
                    ...coords[toReplace],
                    y: coords[toReplace].y - yOffset,
                    nodeID: replacement
                  }
                }
              case "HOVER":
              case "UNBIND":
                return {
                  ...coords,
                  [replacement]: {
                    ...coords[toReplace],
                    y: coords[toReplace].y - yOffset,
                    x: coords[unbindedVar].x - (coords[reduction.consumed].x - coords[toReplace].x),
                    nodeID: replacement
                  }
                }
              default:
                return coords
            }
          }
          return coords
        },
        coords
      ),
    coords
  )
  if (state.nodes[reduction.abs]) {
    const newChildID = state.nodes[reduction.abs].directChildren[0]
    const newChild = newChildID ? state.nodes[newChildID] : undefined
    if (newChild && newChild.type === "APPLICATION" && coords[reduction.parentApplication]) {
      return {
        [newChildID]: { ...coords[reduction.parentApplication], nodeID: newChildID },
        ...replacementOverrides
      }
    }
  }
  return {
    ...replacementOverrides
  }
}

const calculateCoordOffsets = (settings: DimensionSettings, joins: NodeJoins, state: TreeState): CoordOffsets => {
  const reductionOffsets = (reduction: ReductionStage) => {
    const xOffset = settings.widthMargin + settings.circleRadius
    const afterConsumed = state.nodes[reduction.visibleParent].children(state.nodes)[2]
    return {
      [reduction.consumed]: { x: -xOffset },
      ...(afterConsumed ? { [afterConsumed]: { x: xOffset } } : {})
    }
  }

  const joinOffsets = (): CoordOffsets =>
    _.reduce(
      joins,
      (offsets, join, nodeID) => ({
        ...offsets,
        ...(join.type === "ABSTRACTION" ? { [nodeID]: { x: -(settings.circleRadius + settings.widthMargin) } } : {})
      }),
      {}
    )

  const jOffsets = joinOffsets()
  if (!state.reduction) return jOffsets
  const redOffsets = reductionOffsets(state.reduction)
  return _.mergeWith({}, jOffsets, redOffsets, addOffset)
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
    const coord = addOffset(
      { nodeID: rootID, type: root.type, ...dimensions[rootID], x: baseX, y: baseY },
      offsets[rootID]
    )
    return root.primitives.length
      ? { [rootID]: coord }
      : root.children(tree).reduce(
          (current, nodeID) => {
            const childCoord = fillCoords(nodeID, dimensions, tree, settings, offsets, current.baseX, baseY)
            if (!childCoord[nodeID]) return current
            return {
              baseX: childCoord[nodeID].x + childCoord[nodeID].w + settings.widthMargin,
              coords: { ...current.coords, ...childCoord }
            }
          },
          {
            baseX: coord.x + settings.widthMargin + settings.circleRadius,
            coords: {
              [rootID]: coord
            }
          }
        ).coords
  }
  return {}
}

const addOffset = <A extends NodeCoord | CoordOffset>(coord: A, offset?: CoordOffset): A => {
  if (!coord) return offset as A
  else if (offset)
    return { ...(coord || {}), x: (coord.x || 0) + (offset.x || 0), y: (coord.y || 0) + (offset.y || 0) } as A
  return coord
}
