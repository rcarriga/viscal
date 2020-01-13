import { NodeID } from "../tree"

export type Color = string

const defaultTheme = {
  primary: "#a9ff68",
  secondary: "#8B8B8B",
  foreground: "black",
  background: "#f8f8f8",
  text: "black",
  highlightedStroke: "#3E3D32",
  selectedStroke: "#3E3D32",
  stroke: "grey"
}

export type Theme = typeof defaultTheme

export type ThemeElement = keyof Theme

const defaultDimensions = {
  circleRadius: 32,
  heightMargin: 20,
  strokeWidth: 4,
  widthMargin: 32
}

export type Dimensions = typeof defaultDimensions

export type NodeDimension = keyof Dimensions

const defaultEvents = {
  select: undefined,
  highlight: undefined,
  click: undefined,
  clearHighlight: undefined,
  clearSelect: undefined,
  test: undefined
}

export type NodeEvents = { [event in keyof typeof defaultEvents]?: MouseEventHandler }

export type NodeEvent = keyof NodeEvents

const defaultTreeLayout = {
  startX: 400,
  startY: 200
}

export type TreeLayout = typeof defaultTreeLayout

export type Layout = keyof TreeLayout

type NodeElement = SVGPathElement
export type MouseEventHandler = (event: React.MouseEvent<NodeElement, MouseEvent>) => void

export interface VisualState {
  expression: string
  selected?: NodeID
  highlighted?: NodeID
  theme: Theme
  dimensions: Dimensions
  treeLayout: TreeLayout
  events: NodeEvents
}

export const initialVisualState: VisualState = {
  expression: "",
  theme: defaultTheme,
  dimensions: defaultDimensions,
  treeLayout: defaultTreeLayout,
  events: defaultEvents
}
