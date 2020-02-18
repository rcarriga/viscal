import { useSelector as _useSelector, TypedUseSelectorHook, useDispatch as _useDispatch } from "react-redux"
import { coordsSelector, stylesSelector, BoardState, BoardAction, NodeID, NodeStyle, NodeCoord } from "."

const useSelector: TypedUseSelectorHook<BoardState> = _useSelector

export const useBoard = () => useSelector(state => state)

export const useTreeState = () => useSelector(state => state.tree)

export const useTree = () => useSelector(state => state.tree.nodes)

export const useReduction = () => useSelector(state => state.tree.reduction)

export const useVisualState = () => useSelector(state => state.visual)

export const useLayout = () => useSelector(state => state.visual.treeLayout)

export const useEvents = () => useSelector(state => state.visual.events)

export const useDimensions = () => useSelector(state => state.visual.dimensions)

export const useTheme = () => useSelector(state => state.visual.theme)

export const useStyles = () => useSelector(state => stylesSelector(state))

export const useStyle = (nodeID: NodeID): NodeStyle | undefined => useStyles()[nodeID]

export const useCoords = () => useSelector(state => coordsSelector(state))

export const useHighlighted = () => useSelector(state => state.visual.highlighted)

export const useSelected = () => useSelector(state => state.visual.selected)

export const useExpression = () => useSelector(state => state.visual.expression)

export const useCoord = (nodeID: NodeID): NodeCoord | undefined => {
  const baseCoord = useCoords()[nodeID]
  const layout = useLayout()
  return baseCoord ? { ...baseCoord, x: baseCoord.x + layout.startX, y: baseCoord.y + layout.startY } : undefined
}

export const useDispatch: () => (action: BoardAction) => void = _useDispatch
