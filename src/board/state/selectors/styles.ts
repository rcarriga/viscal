import { createSelector } from "@reduxjs/toolkit"
import { reduceTree, Tree, PrimitiveID, directChildren } from "board/state/tree"
import _ from "lodash"
import randomcolor from "randomcolor"
import { AnimationSettings } from "../visual"
import { BoardState, NodeID, TreeState, Color, Theme, DimensionSettings, TreeNode, ReductionStage } from ".."

type VarColors = { [bindingID in NodeID]: Color }

interface StrokeStyle {
  stroke: string
  strokeWidth: number
  strokeLinecap?: string
}

interface BaseNodeStyle {
  fill: string
  stroke: StrokeStyle
  animation: AnimationSettings
}

export interface VarStyle extends BaseNodeStyle {
  type: "VAR_STYLE"
}

export interface AbsStyle extends BaseNodeStyle {
  type: "ABS_STYLE"
  input: VarStyle
  output: VarStyle
}

export interface ApplStyle extends BaseNodeStyle {
  type: "APPL_STYLE"
  output: VarStyle
}

export interface PrimStyle extends BaseNodeStyle {
  type: "PRIM_STYLE"
  text: { fill: string }
}

export type NodeStyle = VarStyle | AbsStyle | ApplStyle | PrimStyle
type NodeStyles = { [nodeID in NodeID]: NodeStyle }

type StylesState = {
  tree: TreeState
  theme: Theme
  copies: { [nodeID in NodeID]: NodeID }
  colors: VarColors
  dimensions: DimensionSettings
  animation: AnimationSettings
  highlighted?: NodeID
  selected?: NodeID
}

type StyleSettings = {
  transparent?: boolean
  highlighted?: boolean
  selected?: boolean
}

const createStyles = (state: StylesState): NodeStyles => {
  const tree = state.tree.nodes
  const reduction = state.tree.reduction
  const initStyles: NodeStyles = _.pickBy(
    _.mapValues(tree, (_, nodeID: NodeID) => createStyle(nodeID, state, {})),
    (style): style is NodeStyle => _.isObject(style)
  )
  if (!reduction) return initStyles
  switch (reduction.type) {
    case "UNBIND":
      return {
        ...initStyles,
        ...overrideReplacement(reduction, { highlighted: true }, state),
        ...overrideConsumed(reduction, { highlighted: true }, state),
        ...overrideUnbinded(reduction, { transparent: true }, state)
      }
    case "FADE":
      return {
        ...initStyles,
        ...overrideReplacement(reduction, { highlighted: true }, state),
        ...overrideReplaced(reduction, { transparent: true }, state),
        ...overrideRemoved(reduction, { transparent: true }, state),
        ...overrideConsumed(reduction, { transparent: true }, state)
      }
    default:
      return {
        ...initStyles,
        ...overrideReplacement(reduction, { highlighted: true }, state),
        ...overrideConsumed(reduction, { highlighted: true }, state)
      }
  }
}

const overrideUnbinded = (reduction: ReductionStage, override: StyleSettings, state: StylesState): NodeStyles =>
  _.reduce(
    reduction.substitutions,
    (styles, _, unbindedVar) => {
      const style = createStyle(unbindedVar, state, override)
      return style ? { ...styles, [unbindedVar]: style } : styles
    },
    {}
  )

const overrideReplacement = (reduction: ReductionStage, override: StyleSettings, state: StylesState): NodeStyles =>
  _.reduce(
    reduction.substitutions,
    (styles: NodeStyles, substitution) => {
      const newNodeID = substitution.nodes[reduction.consumed]
      if (state.tree.nodes[newNodeID]) {
        const style = createStyle(newNodeID, state, override)
        return style ? { ...styles, [newNodeID]: style } : styles
      }
      return styles
    },
    {}
  )

const overrideReplaced = (reduction: ReductionStage, override: StyleSettings, state: StylesState): NodeStyles =>
  reduceTree(
    state.tree.nodes,
    (styles, _, nodeID) => {
      const style = createStyle(nodeID, state, override)
      return style ? { ...styles, [nodeID]: style } : styles
    },
    {},
    reduction.consumed
  )

const overrideConsumed = (reduction: ReductionStage, override: StyleSettings, state: StylesState): NodeStyles => {
  if (state.tree.nodes[reduction.consumed]) {
    const style = createStyle(reduction.consumed, state, override)
    return style ? { [reduction.consumed]: style } : {}
  }
  return {}
}

const overrideRemoved = (reduction: ReductionStage, override: StyleSettings, state: StylesState): NodeStyles => {
  const absStyle = createStyle(reduction.abs, state, override)
  const applStyle = createStyle(reduction.parentApplication, state, override)
  return {
    ...(absStyle ? { [reduction.abs]: absStyle } : {}),
    ...(applStyle ? { [reduction.parentApplication]: applStyle } : {})
  }
}

const createStyle = (nodeID: NodeID, state: StylesState, overrides: StyleSettings): NodeStyle | undefined => {
  const styleID = state.copies[nodeID] || nodeID
  const node = state.tree.nodes[styleID]
  const binderID = node?.type === "VARIABLE" ? node.binder || styleID : styleID
  const highlighted = (state.highlighted && (state.highlighted === styleID || state.highlighted === binderID)) || false
  const selected = (state.selected && state.selected === styleID) || false
  if (node.primitives.length)
    return createPrimStyle(node.primitives[node.primitives.length - 1], state, { highlighted, selected, ...overrides })
  switch (node.type) {
    case "VARIABLE":
      return createVarStyle(styleID, state, { highlighted, selected, ...overrides })
    case "ABSTRACTION":
      return createAbsStyle(styleID, state, { highlighted, selected, ...overrides })
    case "APPLICATION":
      return createApplStyle(styleID, state, { highlighted, selected, ...overrides })
    default:
      return undefined
  }
}

const createVarStyle = (
  nodeID: NodeID,
  state: StylesState,
  { transparent, selected, highlighted }: StyleSettings
): VarStyle => {
  const node = state.tree.nodes[nodeID]
  const theme = state.theme
  const binderID = node?.type === "VARIABLE" ? node.binder || nodeID : nodeID
  const color = transparent ? theme.transparent : state.colors[binderID] || theme.unbinded
  return {
    type: "VAR_STYLE",
    fill: color,
    animation: state.animation,
    stroke: {
      stroke: transparent
        ? theme.transparent
        : node && node.type !== "VARIABLE"
        ? color
        : selected
        ? theme.selectedStroke
        : highlighted
        ? theme.highlightedStroke
        : !node
        ? color
        : theme.varStroke,
      strokeWidth: state.dimensions.strokeWidth
    }
  }
}

const createAbsStyle = (
  nodeID: NodeID,
  state: StylesState,
  { transparent, selected, highlighted }: StyleSettings
): AbsStyle => {
  const theme = state.theme
  return {
    type: "ABS_STYLE",
    fill: theme.transparent,
    animation: state.animation,
    stroke: {
      stroke: transparent
        ? theme.transparent
        : selected
        ? theme.selectedStroke
        : highlighted
        ? theme.highlightedStroke
        : theme.stroke,
      strokeWidth: state.dimensions.strokeWidth,
      strokeLinecap: "square"
    },
    input: createVarStyle(nodeID, state, { transparent, selected, highlighted }),
    output: createVarStyle("", state, { transparent, selected, highlighted })
  }
}

const createApplStyle = (
  nodeID: NodeID,
  state: StylesState,
  { transparent, selected, highlighted }: StyleSettings
): ApplStyle => {
  const theme = state.theme
  return {
    type: "APPL_STYLE",
    fill: theme.transparent,
    animation: state.animation,
    stroke: {
      stroke: transparent
        ? theme.transparent
        : selected
        ? state.theme.selectedStroke
        : highlighted
        ? state.theme.highlightedStroke
        : state.theme.stroke,
      strokeWidth: state.dimensions.strokeWidth
    },
    output: createVarStyle("", state, { transparent, selected, highlighted })
  }
}

const createPrimStyle = (
  primID: PrimitiveID,
  state: StylesState,
  { transparent, selected, highlighted }: StyleSettings
): PrimStyle => {
  const theme = state.theme
  return {
    type: "PRIM_STYLE",
    fill: transparent ? theme.transparent : theme.stroke,
    animation: state.animation,
    text: {
      fill: transparent ? theme.transparent : theme.text
    },
    stroke: {
      stroke: transparent
        ? theme.transparent
        : selected
        ? state.theme.selectedStroke
        : highlighted
        ? state.theme.highlightedStroke
        : state.theme.stroke,
      strokeWidth: state.dimensions.strokeWidth
    }
  }
}

export const stylesSelector = createSelector(
  (state: BoardState) => ({
    tree: state.tree.present,
    colors: colorsSelector(state),
    copies: state.tree.present.reduction
      ? constructCopyMap(state.tree.present.reduction, state.tree.present.nodes)
      : {},
    theme: state.visual.theme,
    dimensions: state.visual.dimensions,
    animation: state.visual.animation.settings,
    selected: state.visual.selected,
    highlighted: state.visual.highlighted
  }),
  createStyles
)

const constructCopyMap = (reduction: ReductionStage, tree: Tree): { [nodeID in NodeID]: NodeID } => {
  const copyReplaced = () =>
    _.reduce(
      reduction.substitutions,
      (copies, sub) => ({
        ...copies,
        ..._.reduce(sub.nodes, (copies, toReplace, toCopy) => ({ ...copies, [toReplace]: toCopy }), {})
      }),
      {}
    )

  const copyParent = () => {
    const newChildID = directChildren(tree[reduction.abs])[0]
    const newChild = newChildID ? tree[newChildID] : undefined
    return newChild && newChild.type === "APPLICATION" ? { [newChildID]: reduction.parentApplication } : {}
  }

  switch (reduction.type) {
    case "FADE": {
      return {
        ...copyReplaced(),
        ...copyParent()
      }
    }
    case "REMOVE":
      return {}
    default:
      return copyReplaced()
  }
}

const createColors = (tree: TreeState): VarColors => {
  return _.mapValues(tree.nodes, (node, nodeID) => createColor(nodeID, node, tree))
}

const createColor = (nodeID: NodeID, node: TreeNode, tree: TreeState): Color => {
  const color = (nodeID: NodeID) => randomcolor({ seed: nodeID, luminosity: "bright" })
  switch (node.type) {
    case "ABSTRACTION":
      return color(nodeID)
    case "VARIABLE": {
      return node.binder ? color(node.binder) : "rgba(0,0,0,1)"
    }
    default:
      return "transparent"
  }
}

const colorsSelector = createSelector((state: BoardState) => state.tree.present, createColors)
