import { useSelector, TypedUseSelectorHook } from "react-redux"
import { colorsSelector, coordsSelector, NodeID } from "../"
import { AppState } from "../../../state"
import { VARIABLE, ABSTRACTION } from "../tree/"
import { getVariableBinder } from "../tree/util"

export * from "./coords"
export * from "./colors"

export const typedSelector: TypedUseSelectorHook<AppState> = useSelector

export const useColor = (nodeID: NodeID) => {
  return typedSelector(state => {
    const node = state.board.tree.nodes[nodeID]
    const colors = colorsSelector(state.board)
    switch (node.type) {
      case VARIABLE: {
        const binderID = getVariableBinder(nodeID, node.index, state.board.tree)
        return binderID ? colors[binderID] : "black"
      }
      case ABSTRACTION:
        return colors[nodeID]
      default:
        return "transparent"
    }
  })
}

export const useSelected: TypedUseSelectorHook<string | undefined> = callback => {
  return typedSelector(state => callback(state.board.visual.selected))
}

export const useCoords = () => {
  return typedSelector(state => coordsSelector(state.board))
}

export const useTheme = () => {
  return typedSelector(state => state.board.visual.theme)
}

export const useControl = () => {
  return typedSelector(state => state.board.control)
}

export const useEvents = () => {
  return typedSelector(state => state.board.visual.events)
}
