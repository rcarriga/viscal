import {
  NodeDimension,
  DimensionOffsets,
  DimensionOffset,
  NodeDimensions,
  ReductionStage,
  TreeState,
  NodeID,
  Tree,
  DimensionSettings,
  TreeNode,
  NodeJoins
} from "board/state"
import _ from "lodash"

export const constructDimensions = (
  state: TreeState,
  settings: DimensionSettings,
  joins: NodeJoins
): NodeDimensions => {
  const dimensionOffsets = calculateDimensionOffsets(settings, joins, state.reduction)
  return calculateDimensions(state.root, state.nodes, settings, dimensionOffsets)
}

const calculateDimensionOffsets = (
  settings: DimensionSettings,
  joins: NodeJoins,
  reduction?: ReductionStage
): DimensionOffsets => {
  const joinOffsets = (): DimensionOffsets => {
    const maxDistances = _.reduce(
      joins,
      (distances: { [nodeID in NodeID]: number }, join) => {
        const distance = distances[join.jointTo] || 0
        return { ...distances, [join.jointTo]: Math.max(distance, join.distance) }
      },
      {}
    )
    return _.reduce(
      joins,
      (offsets, join, nodeID) => {
        switch (join.type) {
          case "ABSTRACTION":
            return {
              ...offsets,
              [join.jointTo]: { w: -(settings.circleRadius + settings.widthMargin) },
              ...(maxDistances[join.jointTo] > join.distance
                ? { [nodeID]: { w: -(settings.circleRadius + settings.widthMargin) } }
                : {})
            }
          default:
            return {
              ...offsets,
              [join.jointTo]: { w: -settings.widthMargin },
              ...(maxDistances[join.jointTo] > join.distance ? { [nodeID]: { w: -settings.widthMargin } } : {})
            }
        }
      },
      {}
    )
  }

  return joinOffsets()
}

const calculateDimensions = (
  rootID: NodeID,
  tree: Tree,
  settings: DimensionSettings,
  offsets: DimensionOffsets,
  dimensions: NodeDimensions = {}
): NodeDimensions => {
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const childDimensions = root.primitive
      ? dimensions
      : children
          .map(childID => calculateDimensions(childID, tree, settings, offsets, dimensions))
          .reduce((prev, cur) => ({ ...prev, ...cur }), {})
    return {
      ...childDimensions,
      [rootID]: addOffset(
        {
          h: elementHeight(root, childDimensions, settings, tree),
          w: elementWidth(root, childDimensions, settings, tree)
        },
        offsets[rootID]
      )
    }
  }
  return dimensions
}

const elementWidth = (
  node: TreeNode,
  nodeDimensions: NodeDimensions,
  settings: DimensionSettings,
  tree: Tree
): number => {
  const sumChildren = () =>
    node
      .children(tree)
      .map(childID => (tree[childID] ? nodeDimensions[childID].w : -settings.widthMargin))
      .reduce((sum, w) => sum + w + settings.widthMargin, 0)
  if (node.primitive) return settings.circleRadius * 4 + settings.widthMargin * 2
  switch (node.type) {
    case "VARIABLE":
      return settings.circleRadius * 2
    case "ABSTRACTION":
      return sumChildren() + settings.circleRadius * 2 + settings.widthMargin
    case "APPLICATION":
      return sumChildren() + settings.circleRadius + settings.widthMargin
    default:
      return 0
  }
}

const elementHeight = (
  node: TreeNode,
  nodeDimensions: NodeDimensions,
  settings: DimensionSettings,
  tree: Tree
): number => {
  switch (node.type) {
    case "VARIABLE":
      return settings.circleRadius * 2
    case "ABSTRACTION":
      return settings.circleRadius * 2 + settings.heightMargin * 2
    case "APPLICATION":
      return settings.circleRadius * 2 + settings.heightMargin * 2
    default:
      return 0
  }
}

const addOffset = <A extends NodeDimension | DimensionOffset>(coord: A, offset?: DimensionOffset): A =>
  offset
    ? ({
        w: (coord.w || 0) + (offset.w || 0),
        h: (coord.h || 0) + (offset.h || 0)
      } as A)
    : coord
