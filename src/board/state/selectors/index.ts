import { useSelector } from "react-redux"
import { BoardState, colorsSelector, coordsSelector, NodeID } from "../"

export * from "./coords"
export * from "./colors"

export const useBoard = () => useSelector((state: BoardState) => state)

export const useColor = (nodeID: NodeID) => {
  const board = useBoard()
  const node = board.tree.nodes[nodeID]
  const colors = colorsSelector(board)
  switch (node.type) {
    case "VARIABLE": {
      const binderID = node.binder(board.tree)
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

export const useHighligthed = (nodeID: NodeID) => {
  const board = useBoard()
  const node = board.tree.nodes[nodeID]
  if (!node) return false
  if (node.type === "VARIABLE") {
    if (node.binder(board.tree) === board.visual.highlighted) return true
  }
  return board.visual.highlighted === nodeID
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
