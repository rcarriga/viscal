import { NodeID } from "../tree"
import { EventHandler, NodeEvent, DimensionSetting, Layout } from "./types"

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

export type VisualAction =
  | SetSelected
  | SetHighlighted
  | SetEvent
  | SetDimension
  | SetLayout
  | AdjustLayout
  | SetExpression
