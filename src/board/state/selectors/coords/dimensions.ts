import { NodeID, Tree, DimensionSettings, TreeNode } from "../.."
import { ReductionStage, TreeState } from "../../tree"
import { NodeDimension, DimensionOffsets, DimensionOffset, NodeDimensions } from "./types"

export const getDimensions = (
  state: TreeState,
  settings: DimensionSettings,
  reduction?: ReductionStage
): NodeDimensions => {
  const dimensionOffsets = reduction ? calculateDimensionOffsets(settings, reduction, state) : {}
  return calculateDimensions(state.root, state.nodes, settings, dimensionOffsets)
}

const calculateDimensionOffsets = (
  settings: DimensionSettings,
  reduction: ReductionStage,
  state: TreeState
): DimensionOffsets => {
  const wOffset = settings.circleRadius + settings.widthMargin
  switch (reduction.type) {
    case "SUBSTITUTE":
      return {
        [reduction.visibleParent]: {
          w: -wOffset
        }
      }
    case "SHIFT_ABS":
      return {
        [reduction.visibleParent]: {
          w: -wOffset
        },
        [reduction.abs]: { w: -wOffset }
      }
    case "SHIFT_PARENT":
      return {
        [reduction.visibleParent]: {
          w: -(wOffset + (reduction.visibleParent === reduction.parentApplication ? wOffset * 2 : 0))
        },
        [reduction.abs]: { w: -wOffset }
      }
    default:
      return {}
  }
}

const calculateDimensions = (
  rootID: NodeID,
  tree: Tree,
  settings: DimensionSettings,
  offsets: DimensionOffsets,
  coords: NodeDimensions = {}
): NodeDimensions => {
  const root = tree[rootID]
  if (root) {
    const children = root.children(tree)
    const childDimensions = children
      .map(childID => calculateDimensions(childID, tree, settings, offsets, coords))
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
  return coords
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

const addOffset = (coord: NodeDimension, offset?: DimensionOffset): NodeDimension =>
  offset
    ? {
        w: coord.w + (offset.w || 0),
        h: coord.h + (offset.h || 0)
      }
    : coord
