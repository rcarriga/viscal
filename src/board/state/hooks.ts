import { useSelector, useDispatch as _useDispatch } from "react-redux"
import { coordsSelector, stylesSelector, BoardState, BoardAction, NodeID, NodeStyle, NodeCoord } from "."

export const useBoard = () => useSelector((state: BoardState) => state)

export const useTreeState = () => useBoard().tree

export const useTree = () => useTreeState().nodes

export const useReduction = () => useTreeState().reduction

export const useVisualState = () => useBoard().visual

export const useLayout = () => useVisualState().treeLayout

export const useEvents = () => useVisualState().events

export const useDimensions = () => useVisualState().dimensions

export const useTheme = () => useVisualState().theme

export const useStyles = () => stylesSelector(useBoard())

export const useStyle = (nodeID: NodeID): NodeStyle | undefined => useStyles()[nodeID]

export const useCoords = () => coordsSelector(useBoard())

export const useHighlighted = () => useVisualState().highlighted

export const useSelected = () => useVisualState().selected

export const useCoord = (nodeID: NodeID): NodeCoord | undefined => {
  const baseCoord = useCoords()[nodeID]
  const layout = useLayout()
  return baseCoord ? { ...baseCoord, x: baseCoord.x + layout.startX, y: baseCoord.y + layout.startY } : undefined
}

export const useDispatch: () => (action: BoardAction) => void = _useDispatch
