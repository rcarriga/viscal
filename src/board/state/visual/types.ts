import { PanInfo, Transition } from "framer-motion"
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
  unbinded: "rgba(0, 0, 0, 1)"
}

export type Theme = typeof defaultTheme

export type ThemeElement = keyof Theme

const defaultDimensions = {
  circleRadius: 32,
  heightMargin: 20,
  strokeWidth: 4,
  widthMargin: 32
}

export type DimensionSettings = typeof defaultDimensions

export type DimensionSetting = keyof DimensionSettings

const defaultEvents = {
  select: undefined,
  highlight: undefined,
  click: undefined,
  clearHighlight: undefined,
  clearSelect: undefined,
  drag: undefined
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
export type MouseEventHandler = (event: any, panInfo?: PanInfo) => void

export interface AnimationSettings {
  transition: Transition
}
const defaultAnimationSettings: AnimationSettings = {
  transition: {
    stroke: { type: "tween", duration: 0.1 },
    fill: { type: "tween", duration: 0.1 },
    d: { type: "spring", stiffness: 30 }
  }
}

export interface VisualState {
  expression: string
  selected?: NodeID
  highlighted?: NodeID
  theme: Theme
  dimensions: DimensionSettings
  treeLayout: TreeLayout
  events: NodeEvents
  animation: AnimationSettings
}

export const initialVisualState: VisualState = {
  expression: "",
  theme: defaultTheme,
  dimensions: defaultDimensions,
  treeLayout: defaultTreeLayout,
  events: defaultEvents,
  animation: defaultAnimationSettings
}
