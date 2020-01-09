import { NodeID } from "../tree"
import { MouseEventHandler } from "./types"

export const SET_SELECTED = "SET_SELECTED"
export const SET_HIGHLIGHTED = "SET_HIGHLIGHTED"
export const SET_EVENT = "SET_EVENT"

interface SetSelected {
  type: typeof SET_SELECTED
  nodeID?: string
}

interface SetHighlighted {
  type: typeof SET_HIGHLIGHTED
  variableName?: NodeID
}

interface SetEvent {
  type: typeof SET_EVENT
  eventName: "onClick" | "onMouseOver" | "onMouseLeave"
  handler?: MouseEventHandler
}

export const setSelected = (nodeID?: string): VisualAction => ({
  type: SET_SELECTED,
  nodeID
})

export const setHighlighted = (variableName?: string): VisualAction => ({
  type: SET_HIGHLIGHTED,
  variableName
})

export const setOnClick = (handler?: MouseEventHandler): VisualAction => ({
  type: SET_EVENT,
  eventName: "onClick",
  handler: handler
})

export const setOnMouseOver = (handler?: MouseEventHandler): VisualAction => ({
  type: SET_EVENT,
  eventName: "onMouseOver",
  handler: handler
})

export const setOnMouseLeave = (handler?: MouseEventHandler): VisualAction => ({
  type: SET_EVENT,
  eventName: "onMouseLeave",
  handler: handler
})

export type VisualAction = SetSelected | SetHighlighted | SetEvent
