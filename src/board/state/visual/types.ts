import { NodeID } from "../tree"

export type Color = string

export type ThemeElement = "highlightedStroke" | "selectedStroke" | "stroke"

export type Theme = { [element in ThemeElement]: Color }

export type NodeDimension = "circleRadius" | "heightMargin" | "widthMargin" | "strokeWidth"

export type Dimensions = { [dimension in NodeDimension]: number }

export type NodeEvent = "select" | "highlight" | "click" | "clearhighlight"

export type NodeEvents = { [event in NodeEvent]?: MouseEventHandler }

export type TreeLayout = "startX" | "startY"

export type Layout = { [layout in TreeLayout]: number }

type NodeElement = SVGPathElement & React.HTMLAttributes<{ "data-nodeid": string }>
export type MouseEventHandler = (event: React.MouseEvent<NodeElement, MouseEvent>) => void

export interface VisualState {
  expression: string
  selected?: NodeID
  highlighted?: NodeID
  theme: Theme
  dimensions: Dimensions
  treeLayout: Layout
  events: NodeEvents
}
