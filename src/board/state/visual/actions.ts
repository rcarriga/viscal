import { VarID, Color } from "./types"

export const NEW_COLOR = "NEW_COLOR"
export const SET_COLOR = "SET_COLOR"
export const SET_SELECTED = "SET_SELECTED"
export const SET_HIGHLIGHTED = "SET_HIGHLIGHTED"

interface NewColor {
  type: typeof NEW_COLOR
  variableName: VarID
}

interface SetColor {
  type: typeof SET_COLOR
  variableName: VarID
  color: Color
}

interface SetSelected {
  type: typeof SET_SELECTED
  nodeID?: string
}

interface SetHighlighted {
  type: typeof SET_HIGHLIGHTED
  variableName?: VarID
}

export const newColor = (variableName: VarID): VisualAction => ({
  type: NEW_COLOR,
  variableName
})
export const setColor = (variableName: VarID, color: Color): VisualAction => ({
  type: SET_COLOR,
  variableName,
  color
})

export const setSelected = (nodeID: string): VisualAction => ({
  type: SET_SELECTED,
  nodeID
})

export const setHighlighted = (variableName: string): VisualAction => ({
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

export type VisualAction = NewColor | SetColor | SetSelected | SetHighlighted
