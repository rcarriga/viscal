import { NodeID } from "board/state"

const defaultEvents = {
  onMouseOver: () => {},
  onMouseLeave: () => {},
  onClick: () => {}
}

export type EventHandler = (nodeID: NodeID) => void
export type NodeEvents = { [event in keyof typeof defaultEvents]: EventHandler }
export type NodeEvent = keyof NodeEvents

export interface RawExprProps {
  id: string
  x: number
  y: number
  events: NodeEvents
}

export interface BaseElementValues {
  type: string
  key: string
  animated: any
  static: any
}

export interface PathElementValues extends BaseElementValues {
  type: "PATH"
}

export interface TextElementValues extends BaseElementValues {
  type: "TEXT"
  text: string
}

export type ExprElementValues = PathElementValues | TextElementValues
