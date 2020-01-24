import _ from "lodash"
import randomcolor from "randomcolor"
import { createSelector } from "reselect"
import { AnimationSettings } from "../visual"
import { useBoard } from "./base"
import { BoardState, NodeID, TreeState, Color, Theme, DimensionSettings, TreeNode } from ".."

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
  colors: VarColors
  dimensions: DimensionSettings
  animation: AnimationSettings
  highlighted?: NodeID
  selected?: NodeID
}

export const useStyles = (): NodeStyles => {
  const board = useBoard()
  return stylesSelector(board)
}

const createStyles = (state: StylesState): NodeStyles => {
  const tree = state.tree.nodes
  const reduction = state.tree.reduction
  const initStyles = Object.keys(tree).reduce((styles: NodeStyles, nodeID: NodeID) => {
    const style = createStyle(nodeID, state)
    return style ? { ...styles, [nodeID]: style } : styles
  }, {})
  if (!reduction) return initStyles
  switch (reduction.type) {
    case "UNBIND":
      return Object.values(reduction.substitutions).reduce(
        (styles: NodeStyles, substitution) =>
          Object.values(substitution).reduce((styles, toHide) => {
            const style = createStyle(toHide, state, true)
            return style ? { ...styles, [toHide]: style } : styles
          }, styles),
        initStyles
      )
    default:
      return initStyles
  }
}

const createStyle = (nodeID: NodeID, state: StylesState, transparent = false): NodeStyle | undefined => {
  const node = state.tree.nodes[nodeID]
  switch (node.type) {
    case "VARIABLE":
      return createVarStyle(nodeID, state, transparent)
    case "ABSTRACTION":
      return createAbsStyle(nodeID, state, transparent)
    case "APPLICATION":
      return createApplStyle(nodeID, state, transparent)
    default:
      return undefined
  }
}

const createVarStyle = (nodeID: NodeID, state: StylesState, transparent: boolean): VarStyle => {
  const node = state.tree.nodes[nodeID]
  const theme = state.theme
  const binder = node && node.type === "VARIABLE" ? node.binder(state.tree) || nodeID : nodeID
  const isHighlighted = state.highlighted && (state.highlighted === nodeID || state.highlighted === binder)
  const isSelected = state.selected && state.selected === nodeID
  return {
    type: "VAR_STYLE",
    fill: transparent ? theme.transparent : state.colors[binder] || theme.unbinded,
    animation: state.animation,
    stroke: {
      stroke: transparent
        ? theme.transparent
        : isSelected
        ? theme.selectedStroke
        : isHighlighted
        ? theme.highlightedStroke
        : theme.varStroke,
      strokeWidth: state.dimensions.strokeWidth
    }
  }
}

const createAbsStyle = (nodeID: NodeID, state: StylesState, transparent: boolean): AbsStyle => {
  const theme = state.theme
  const isHighlighted = state.highlighted === nodeID
  const isSelected = state.selected && state.selected === nodeID
  return {
    type: "ABS_STYLE",
    fill: theme.transparent,
    animation: state.animation,
    stroke: {
      stroke: transparent
        ? theme.transparent
        : isSelected
        ? theme.selectedStroke
        : isHighlighted
        ? theme.highlightedStroke
        : theme.stroke,
      strokeWidth: state.dimensions.strokeWidth
    },
    input: createVarStyle(nodeID, state, transparent),
    output: createVarStyle("", state, transparent)
  }
}

const createApplStyle = (nodeID: NodeID, state: StylesState, transparent: boolean): ApplStyle => {
  const theme = state.theme
  const isHighlighted = state.highlighted === nodeID
  const isSelected = state.selected === nodeID
  return {
    type: "APPL_STYLE",
    fill: theme.transparent,
    animation: state.animation,
    stroke: {
      stroke: isSelected
        ? state.theme.selectedStroke
        : isHighlighted
        ? state.theme.highlightedStroke
        : state.theme.stroke,
      strokeWidth: state.dimensions.strokeWidth
    },
    output: createVarStyle("", state, transparent)
  }
}

const stylesSelector = createSelector(
  (state: BoardState) => ({
    tree: state.tree,
    colors: colorsSelector(state),
    theme: state.visual.theme,
    dimensions: state.visual.dimensions,
    animation: state.visual.animation,
    selected: state.visual.selected,
    highlighted: state.visual.highlighted
  }),
  createStyles
)

const createColors = (tree: TreeState): VarColors => {
  return _.reduce(
    tree.nodes,
    (colors, node, nodeID) => ({
      ...colors,
      [nodeID]: createColor(nodeID, node, tree)
    }),
    {}
  )
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
