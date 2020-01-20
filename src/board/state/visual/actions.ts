import { NodeID } from "../tree"
import { MouseEventHandler, NodeEvent, NodeDimension, Layout } from "./types"

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
  dimension: NodeDimension
  value: number
}

interface SetEvent {
  type: "SET_EVENT"
  event: NodeEvent
  handler?: MouseEventHandler
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

export const setSelected = (nodeID?: string): VisualAction => ({
  type: "SET_SELECTED",
  nodeID
})

export const setHighlighted = (variableName?: string): VisualAction => ({
  type: "SET_HIGHLIGHTED",
  variableName
})

export const setEvent = (event: NodeEvent, handler?: MouseEventHandler): VisualAction => ({
  type: "SET_EVENT",
  event,
  handler
})

export const setDimension = (dimension: NodeDimension, value: number): VisualAction => ({
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

export type VisualAction =
  | SetSelected
  | SetHighlighted
  | SetEvent
  | SetDimension
  | SetLayout
  | AdjustLayout
