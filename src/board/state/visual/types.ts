import { Orchestration, Tween } from "framer-motion"
import { NodeID } from "../tree"

export type Color = string

const defaultTheme = {
  primary: "rgba(169,255,104, 1)",
  secondary: "rgba(248, 248, 248,1)",
  foreground: "rgba(0,0,0,1)",
  background: "rgba(248, 248, 248,1)",
  text: "rgba(248, 248, 248,1)",
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

export type EventHandler = (nodeID: NodeID) => void

export type AnimationSetting = keyof AnimationSettings

export type AnimationSettings = Orchestration & Tween

export type AnimationMode = "STOP" | "PLAY" | "FORWARD" | "REVERSE"

export interface AnimationState {
  settings: AnimationSettings
  enabled: boolean
  mode: AnimationMode
}

const defaultAnimationState: AnimationState = {
  settings: {
    type: "tween",
    duration: 0.5
  },
  enabled: true,
  mode: "STOP"
}

export interface VisualState {
  expression: string
  selected: NodeID[]
  highlighted: NodeID[]
  theme: Theme
  dimensions: DimensionSettings
  animation: AnimationState
}

export const initialVisualState: VisualState = {
  expression: "",
  selected: [],
  highlighted: [],
  theme: defaultTheme,
  dimensions: defaultDimensions,
  animation: defaultAnimationState
}
