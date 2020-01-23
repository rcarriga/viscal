import { NodeID, Tree, DimensionSettings, TreeNode } from "../.."
import { ReductionStage } from "../../tree"
import { NodeDimension, DimensionOffsets, DimensionOffset, NodeDimensions } from "./types"

export const getDimensions = (
  root: NodeID,
  tree: Tree,
  settings: DimensionSettings,
  reduction?: ReductionStage
): NodeDimensions => {
  const dimensionOffsets = reduction ? calculateDimensionOffsets(tree, settings, reduction) : {}
  return calculateDimensions(root, tree, settings, dimensionOffsets)
}

const calculateDimensionOffsets = (
  tree: Tree,
  settings: DimensionSettings,
  reduction: ReductionStage
): DimensionOffsets => {
  const parentNode = tree[reduction.parent]
  if (parentNode) {
    const [absID, nodeID] = parentNode.children(tree)
    if (absID && nodeID) {
      const wOffset = settings.circleRadius + settings.widthMargin
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
  const maxChildren = () =>
    Math.max(...node.children(tree).map(childID => nodeDimensions[childID].h)) || settings.circleRadius * 2

  switch (node.type) {
    case "VARIABLE":
      return settings.circleRadius * 2
    case "ABSTRACTION":
      return maxChildren() + settings.heightMargin * 2
    case "APPLICATION":
      return maxChildren() + settings.heightMargin * 2
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
