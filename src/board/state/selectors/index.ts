import { useSelector } from "react-redux"
import { BoardState, colorsSelector, coordsSelector, NodeID, VarIndex } from "../"
import { getVariableBinder } from "./util"

export * from "./coords"
export * from "./colors"

export const useBoard = () => useSelector((state: BoardState) => state)

export const useColor = (nodeID: NodeID) => {
  const board = useBoard()
  const node = board.tree.nodes[nodeID]
  const colors = colorsSelector(board)
  switch (node.type) {
    case "VARIABLE": {
      const binderID = getVariableBinder(nodeID, node.index, board.tree)
      return binderID ? colors[binderID] : "black"
    }
    case "ABSTRACTION":
      return colors[nodeID]
    default:
      return "transparent"
  }
}

export const useSelected = () => {
  return useBoard().visual.selected
}

export const useHighligthed = (nodeID: NodeID, index: VarIndex) => {
  const board = useBoard()
  const binder = getVariableBinder(nodeID, index, board.tree)
  return binder ? binder === board.visual.highlighted : false
}
export const useCoords = () => {
  return coordsSelector(useBoard())
}

export const useTree = () => {
  return useBoard().tree
}

export const useTheme = () => {
  return useBoard().visual.theme
}

export const useEvents = () => {
  return useBoard().visual.events
}

export const useDimensions = () => {
  return useBoard().visual.dimensions
}

export const useLayout = () => {
  return useBoard().visual.treeLayout
}
