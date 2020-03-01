import { NodeID } from "../tree"
import {
  EventHandler,
  NodeEvent,
  DimensionSetting,
  Layout,
  AnimationMode,
  AnimationSettings,
  AnimationSetting
} from "./types"

interface SetSelected {
  type: "SET_SELECTED"
  nodeID?: string
}

interface SetHighlighted {
  type: "SET_HIGHLIGHTED"
  variableName?: NodeID
}

interface SetDimension {
  type: "SET_NODE_DIMENSION"
  dimension: DimensionSetting
  value: number
}

interface UpdateDimensions {
  type: "UPDATE_DIMENSIONS"
  dimensions: { [setting in DimensionSetting]: number }
}

interface SetEvent {
  type: "SET_EVENT"
  event: NodeEvent
  handler?: EventHandler
}

interface SetLayout {
  type: "SET_TREE_LAYOUT"
  parameter: Layout
  value: number
}

interface AdjustLayout {
  type: "ADJUST_TREE_LAYOUT"
  parameter: Layout
  value: number
}

interface SetExpression {
  type: "SET_EXPRESSION"
  expr: string
}

interface SetMode {
  type: "SET_MODE"
  mode: AnimationMode
}

interface SetAnimationEnabled {
  type: "SET_ANIMATION_ENABLED"
  value: boolean
}

interface SetAnimationSetting {
  type: "SET_ANIMATION_SETTING"
  setting: keyof AnimationSettings
  value: any
}

export const setSelected = (nodeID?: string): VisualAction => ({
  type: "SET_SELECTED",
  nodeID
})

export const setHighlighted = (variableName?: string): VisualAction => ({
  type: "SET_HIGHLIGHTED",
  variableName
})

export const setEvent = (event: NodeEvent, handler?: EventHandler): VisualAction => ({
  type: "SET_EVENT",
  event,
  handler
})

export const setDimension = (dimension: DimensionSetting, value: number): VisualAction => ({
  type: "SET_NODE_DIMENSION",
  dimension,
  value
})

export const setLayout = (parameter: Layout, value: number): VisualAction => ({
  type: "SET_TREE_LAYOUT",
  parameter,
  value
})

export const adjustLayout = (parameter: Layout, value: number): VisualAction => ({
  type: "ADJUST_TREE_LAYOUT",
  parameter,
  value
})

export const setExpression = (expr: string): VisualAction => ({
  type: "SET_EXPRESSION",
  expr
})

export const setMode = (mode: AnimationMode): VisualAction => ({
  type: "SET_MODE",
  mode
})

export const setAnimationSetting = <A extends AnimationSettings, K extends AnimationSetting>(
  setting: K,
  value: A[K]
): VisualAction => ({
  type: "SET_ANIMATION_SETTING",
  setting,
  value
})

export const setAnimationEnabled = (value: boolean): VisualAction => ({
  type: "SET_ANIMATION_ENABLED",
  value
})

export const updateDimensions = (dimensions: { [dimension in DimensionSetting]: number }): VisualAction => ({
  type: "UPDATE_DIMENSIONS",
  dimensions
})

export type VisualAction =
  | SetSelected
  | SetHighlighted
  | SetEvent
  | SetDimension
  | UpdateDimensions
  | SetLayout
  | AdjustLayout
  | SetExpression
  | SetMode
  | SetAnimationSetting
  | SetAnimationEnabled
