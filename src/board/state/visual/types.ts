import { NodeID } from "../tree"

export type VarID = string
export type Color = string
export type VarColors = { [varName in VarID]: Color }

export interface Theme {
  selectedStroke: Color
}

export interface VisualState {
  colors: { [varName in VarID]: Color }
  selected?: NodeID
  highlighted?: VarID
  theme: Theme
}
