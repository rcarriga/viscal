import _ from "lodash"
import randomcolor from "randomcolor"
import { createSelector } from "reselect"
import { useBoard } from "./base"
import { BoardState, NodeID, TreeState, Color, Theme, Dimensions, TreeNode } from ".."

export const useVarStyle = (nodeID: NodeID): VarStyle => {
  const state = useStylesState()
  const colors = useColors()
  const node = state.tree.nodes[nodeID]
  const binder = node && node.type === "VARIABLE" ? node.binder(state.tree) || nodeID : nodeID
  const isHighlighted =
    state.highlighted && (state.highlighted === nodeID || state.highlighted === binder)
  const isSelected = state.selected && state.selected === nodeID
  return {
    type: "VAR_STYLE",
    fill: colors[binder] || "black",
    stroke: {
      stroke: isSelected
        ? state.theme.selectedStroke
        : isHighlighted
        ? state.theme.highlightedStroke
        : state.theme.varStroke,
      strokeWidth: state.dimensions.strokeWidth
    }
  }
}

export const useAbsStyle = (nodeID: NodeID): AbsStyle => {
  const state = useStylesState()
  const isHighlighted = state.highlighted === nodeID
  const isSelected = state.selected && state.selected === nodeID
  return {
    type: "ABS_STYLE",
    fill: "transparent",
    stroke: {
      stroke: isSelected
        ? state.theme.selectedStroke
        : isHighlighted
        ? state.theme.highlightedStroke
        : state.theme.stroke,
      strokeWidth: state.dimensions.strokeWidth
    },
    input: useVarStyle(nodeID),
    output: useVarStyle("")
  }
}

export const useApplStyle = (nodeID: NodeID): ApplStyle => {
  const state = useStylesState()
  const isHighlighted = state.highlighted === nodeID
  const isSelected = state.selected === nodeID
  return {
    type: "APPL_STYLE",
    fill: "transparent",
    stroke: {
      stroke: isSelected
        ? state.theme.selectedStroke
        : isHighlighted
        ? state.theme.highlightedStroke
        : state.theme.stroke,
      strokeWidth: state.dimensions.strokeWidth
    },
    output: useVarStyle("")
  }
}

type VarColors = { [bindingID in NodeID]: Color }

interface StrokeStyle {
  stroke: string
  strokeWidth: number
}

export interface VarStyle {
  type: "VAR_STYLE"
  fill: string
  stroke: StrokeStyle
}

export interface AbsStyle {
  type: "ABS_STYLE"
  fill: string
  stroke: StrokeStyle
  input: VarStyle
  output: VarStyle
}

export interface ApplStyle {
  type: "APPL_STYLE"
  fill: string
  stroke: StrokeStyle
  output: VarStyle
}

export type NodeStyle = VarStyle | AbsStyle | ApplStyle

type StylesState = {
  tree: TreeState
  theme: Theme
  dimensions: Dimensions
  highlighted?: NodeID
  selected?: NodeID
}

const useStylesState: () => StylesState = () => {
  const state = useBoard()
  return {
    tree: state.tree,
    theme: state.visual.theme,
    dimensions: state.visual.dimensions,
    selected: state.visual.selected,
    highlighted: state.visual.highlighted
  }
}

const useColors: () => VarColors = () => {
  return colorsSelector(useBoard())
}

const constructColors = (tree: TreeState): VarColors => {
  return _.reduce(
    tree.nodes,
    (colors, node, nodeID) => ({
      ...colors,
      [nodeID]: createColor(nodeID, node, tree)
    }),
    {}
  )
}

const colorsSelector = createSelector((state: BoardState) => state.tree, constructColors)

const createColor = (nodeID: NodeID, node: TreeNode, tree: TreeState): Color => {
  const color = (nodeID: NodeID) => randomcolor({ seed: nodeID, luminosity: "bright" })
  switch (node.type) {
    case "ABSTRACTION":
      return color(nodeID)
    case "VARIABLE": {
      const binder = node.binder(tree)
      return binder ? color(binder) : "black"
    }
    default:
      return "transparent"
  }
}
