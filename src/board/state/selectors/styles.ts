import randomcolor from "randomcolor"
import { createSelector } from "reselect"
import { reduceObj } from "../../util"
import { AnimationSettings } from "../visual"
import { useBoard } from "./base"
import { BoardState, NodeID, TreeState, Color, Theme, DimensionSettings, TreeNode, ReductionStage } from ".."

type VarColors = { [bindingID in NodeID]: Color }

interface StrokeStyle {
  stroke: string
  strokeWidth: number
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

export type NodeStyle = VarStyle | AbsStyle | ApplStyle
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

type StyleOverride = {
  transparent?: boolean
  highlighted?: boolean
  selected?: boolean
}

export const useStyles = (): NodeStyles => {
  const board = useBoard()
  return stylesSelector(board)
}

const createStyles = (state: StylesState): NodeStyles => {
  const tree = state.tree.nodes
  const reduction = state.tree.reduction
  const initStyles = reduceObj(tree, {}, (styles: NodeStyles, _, nodeID: NodeID) => {
    const style = createStyle(nodeID, state, {})
    return style ? { ...styles, [nodeID]: style } : styles
  })
  if (!reduction) return initStyles
  switch (reduction.type) {
    case "UNBIND":
      return overrideUnbinded(
        reduction,
        { transparent: true },
        state,
        overrideConsumed(
          reduction,
          { highlighted: true },
          state,
          overrideNewNodes(reduction, { highlighted: true }, state, initStyles)
        )
      )
    default:
      return overrideConsumed(
        reduction,
        { highlighted: true },
        state,
        overrideNewNodes(reduction, { highlighted: true }, state, initStyles)
      )
  }
}

const overrideUnbinded = (
  reduction: ReductionStage,
  override: StyleOverride,
  state: StylesState,
  styles: NodeStyles
): NodeStyles =>
  reduceObj(reduction.substitutions, styles, (styles, _, unbindedVar) => {
    const style = createStyle(unbindedVar, state, override)
    return style ? { ...styles, [unbindedVar]: style } : styles
  })

const overrideNewNodes = (
  reduction: ReductionStage,
  override: StyleOverride,
  state: StylesState,
  styles: NodeStyles
): NodeStyles =>
  reduceObj(reduction.substitutions, styles, (styles: NodeStyles, substitution) =>
    reduceObj(substitution, styles, (styles, newNodeID) => {
      if (state.tree.nodes[newNodeID]) {
        const style = createStyle(newNodeID, state, override)
        return style ? { ...styles, [newNodeID]: style } : styles
      }
      return styles
    })
  )

const overrideConsumed = (
  reduction: ReductionStage,
  override: StyleOverride,
  state: StylesState,
  styles: NodeStyles
): NodeStyles =>
  reduceObj(reduction.substitutions, styles, (styles: NodeStyles, substitution) =>
    reduceObj(substitution, styles, (styles, _, newNodeID) => {
      if (state.tree.nodes[newNodeID]) {
        const style = createStyle(newNodeID, state, override)
        return style ? { ...styles, [newNodeID]: style } : styles
      }
      return styles
    })
  )

const createStyle = (nodeID: NodeID, state: StylesState, overrides: StyleOverride): NodeStyle | undefined => {
  const styleID = state.copies[nodeID] || nodeID
  const node = state.tree.nodes[styleID]
  const binder = node && node.type === "VARIABLE" ? node.binder(state.tree) || styleID : styleID
  const highlighted = (state.highlighted && (state.highlighted === styleID || state.highlighted === binder)) || false
  const selected = (state.selected && state.selected === styleID) || false
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
  { transparent, selected, highlighted }: StyleOverride
): VarStyle => {
  const node = state.tree.nodes[nodeID]
  const theme = state.theme
  const binder = node && node.type === "VARIABLE" ? node.binder(state.tree) || nodeID : nodeID
  return {
    type: "VAR_STYLE",
    fill: transparent ? theme.transparent : state.colors[binder] || theme.unbinded,
    animation: state.animation,
    stroke: {
      stroke: transparent
        ? theme.transparent
        : selected
        ? theme.selectedStroke
        : highlighted
        ? theme.highlightedStroke
        : theme.varStroke,
      strokeWidth: state.dimensions.strokeWidth
    }
  }
}

const createAbsStyle = (
  nodeID: NodeID,
  state: StylesState,
  { transparent, selected, highlighted }: StyleOverride
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
      strokeWidth: state.dimensions.strokeWidth
    },
    input: createVarStyle(nodeID, state, { transparent, selected, highlighted }),
    output: createVarStyle("", state, { transparent, selected, highlighted })
  }
}

const createApplStyle = (
  nodeID: NodeID,
  state: StylesState,
  { transparent, selected, highlighted }: StyleOverride
): ApplStyle => {
  const theme = state.theme
  return {
    type: "APPL_STYLE",
    fill: theme.transparent,
    animation: state.animation,
    stroke: {
      stroke: selected ? state.theme.selectedStroke : highlighted ? state.theme.highlightedStroke : state.theme.stroke,
      strokeWidth: state.dimensions.strokeWidth
    },
    output: createVarStyle("", state, { transparent, selected, highlighted })
  }
}

const stylesSelector = createSelector(
  (state: BoardState) => ({
    tree: state.tree,
    colors: colorsSelector(state),
    copies: state.tree.reduction ? constructCopyMap(state.tree.reduction) : {},
    theme: state.visual.theme,
    dimensions: state.visual.dimensions,
    animation: state.visual.animation,
    selected: state.visual.selected,
    highlighted: state.visual.highlighted
  }),
  createStyles
)

const constructCopyMap = (reduction: ReductionStage): { [nodeID in NodeID]: NodeID } => {
  switch (reduction.type) {
    case "REMOVE":
      return {}
    default:
      return reduceObj(reduction.substitutions, {}, (copies, sub) => ({
        ...copies,
        ...reduceObj(sub, {}, (copies, toReplace, toCopy) => ({ ...copies, [toReplace]: toCopy }))
      }))
  }
}

const createColors = (tree: TreeState): VarColors => {
  return reduceObj(tree.nodes, {}, (colors, node, nodeID) => ({
    ...colors,
    [nodeID]: createColor(nodeID, node, tree)
  }))
}

const createColor = (nodeID: NodeID, node: TreeNode, tree: TreeState): Color => {
  const color = (nodeID: NodeID) => randomcolor({ seed: nodeID, luminosity: "bright" })
  switch (node.type) {
    case "ABSTRACTION":
      return color(nodeID)
    case "VARIABLE": {
      const binder = node.binder(tree)
      return binder ? color(binder) : "rgba(0,0,0,1)"
    }
    default:
      return "transparent"
  }
}

const colorsSelector = createSelector((state: BoardState) => state.tree, createColors)
