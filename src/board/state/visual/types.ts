import { NodeID as NodeID_ } from "../tree"

export type NodeID = NodeID_
export type VarName = string
export type VarColor = string

export interface VisualState {
  colors: { [varName in VarName]: VarColor }
  selected?: NodeID
  highlighted?: VarName
}
