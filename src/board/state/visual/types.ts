import { NodeID } from "../tree"

export type Color = string

export interface Theme {
  selectedStroke: Color
  stroke: Color
}

export interface VisualState {
  selected?: NodeID
  highlighted?: NodeID
  theme: Theme
}
