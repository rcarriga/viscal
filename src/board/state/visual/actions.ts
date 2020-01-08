import { NodeID } from "../tree"

export const SET_SELECTED = "SET_SELECTED"
export const SET_HIGHLIGHTED = "SET_HIGHLIGHTED"

interface SetSelected {
  type: typeof SET_SELECTED
  nodeID?: string
}

interface SetHighlighted {
  type: typeof SET_HIGHLIGHTED
  variableName?: NodeID
}

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

export type VisualAction = SetSelected | SetHighlighted
