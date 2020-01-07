import { NodeID } from "../tree"

export type VarName = string
export type Color = string
export type VarColors = { [varName in VarName]: Color }

export interface Theme {
  selectedStroke: Color
}

export interface VisualState {
  colors: { [varName in VarName]: Color }
  selected?: NodeID
  highlighted?: VarName
  theme: Theme
}
