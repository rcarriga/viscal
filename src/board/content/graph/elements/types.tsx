import { NodeEvents } from "board/state"

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

