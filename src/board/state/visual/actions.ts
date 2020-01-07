import { VarName, VarColor, NodeID } from "./types"

export const SET_COLOR = "SET_COLOR"
export const SET_SELECTED = "SET_SELECTED"
export const SET_HIGHLIGHTED = "SET_HIGHLIGHTED"

interface SetColor {
  type: typeof SET_COLOR
  variableName: VarName
  color: VarColor
}

interface SetSelected {
  type: typeof SET_SELECTED
  nodeID?: NodeID
}

interface SetHighlighted {
  type: typeof SET_HIGHLIGHTED
  variableName?: VarName
}

export const setColor = (variableName: VarName, color: VarColor): VisualAction => ({
  type: SET_COLOR,
  variableName,
  color
})

export const setSelected = (nodeID: NodeID): VisualAction => ({
  type: SET_SELECTED,
  nodeID
})

export const setHighlighted = (variableName: NodeID): VisualAction => ({
  type: SET_HIGHLIGHTED,
  variableName
})

export const clearHighlighted = (): VisualAction => ({
  type: SET_HIGHLIGHTED,
  variableName: undefined
})

export const clearSelected = (): VisualAction => ({
  type: SET_SELECTED,
  nodeID: undefined
})

export type VisualAction = SetColor | SetSelected | SetHighlighted
