import { NodeID } from "../tree"

export type Color = string

export interface Theme {
  selectedStroke: Color
  stroke: Color
}

type NodeElement = SVGPathElement & React.HTMLAttributes<{ "data-nodeid": string }>
export type MouseEventHandler = (event: React.MouseEvent<NodeElement, MouseEvent>) => void

export interface VisualState {
  selected?: NodeID
  highlighted?: NodeID
  theme: Theme
  events: {
    onClick?: MouseEventHandler
    onMouseOver?: MouseEventHandler
    onMouseLeave?: MouseEventHandler
  }
}
