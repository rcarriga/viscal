import { NodeID } from "../tree"

export type Color = string

const defaultTheme = {
  primary: "rgba(169,255,104, 1)",
  secondary: "rgba(248, 248, 248,1)",
  foreground: "rgba(0,0,0,1)",
  background: "rgba(248, 248, 248,1)",
  text: "rgba(0,0,0,1)",
  highlightedStroke: "rgba(62, 61, 50, 1)",
  selectedStroke: "rgba(62, 61, 50, 1)",
  stroke: "rgba(139, 139, 139, 1)",
  varStroke: "rgba(0,0,0,0)",
  transparent: "rgba(0, 0, 0, 0)",
  unbinded: "rgba(139, 139, 139, 1)"
}

export type Theme = typeof defaultTheme

export type ThemeElement = keyof Theme

const defaultDimensions = {
  circleRadius: 32,
  heightMargin: 40,
  strokeWidth: 4,
  widthMargin: 50
}

export type DimensionSettings = typeof defaultDimensions

export type DimensionSetting = keyof DimensionSettings

const defaultEvents = {
  select: () => {},
  highlight: () => {},
  click: () => {},
  clearHighlight: () => {},
  clearSelect: () => {},
  drag: () => {},
  rest: () => {},
  move: () => {}
}

export type NodeEvents = { [event in keyof typeof defaultEvents]: EventHandler }

export type NodeEvent = keyof NodeEvents

const defaultTreeLayout = {
  startX: 400,
  startY: 400
}

export type TreeLayout = typeof defaultTreeLayout

export type Layout = keyof TreeLayout

export type EventHandler = (nodeID: NodeID) => void

export interface AnimationSettings {}

export interface AnimationState {
  settings: AnimationSettings
  moving: Set<NodeID>
}

const defaultAnimationState: AnimationState = {
  settings: {},
  moving: new Set()
}

export interface VisualState {
  expression: string
  selected?: NodeID
  highlighted?: NodeID
  theme: Theme
  dimensions: DimensionSettings
  treeLayout: TreeLayout
  events: NodeEvents
  animation: AnimationState
}

export const initialVisualState: VisualState = {
  expression: "",
  theme: defaultTheme,
  dimensions: defaultDimensions,
  treeLayout: defaultTreeLayout,
  events: defaultEvents,
  animation: defaultAnimationState
}
