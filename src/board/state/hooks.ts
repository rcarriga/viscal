import { textTreeSelector } from "board/state/selectors/text"
import { useSelector as _useSelector, TypedUseSelectorHook } from "react-redux"
import { BoardState, coordsSelector, stylesSelector, NodeID, NodeStyle, NodeCoord, joinsSelector } from "."

const useSelector: TypedUseSelectorHook<BoardState> = _useSelector

export const useBoard = () => useSelector(state => state)

export const useTreeState = () => useSelector(state => state.tree.present)

export const useTree = () => useSelector(state => state.tree.present.nodes)

export const useRoot = () => useSelector(state => state.tree.present.root)

export const useOriginalRoot = () => useSelector(state => state.tree.present.originalRoot)

export const useReduction = () => useSelector(state => state.tree.present.reduction)

export const useReducer = () => useSelector(state => state.tree.present.reducer)

export const usePrimitives = () => useSelector(state => state.tree.present.primitives)

export const useNodePrimitive = (nodeID: NodeID) =>
  useSelector(state => {
    const tree = state.tree.present
    const node = tree.nodes[nodeID]
    return node.primitives.length ? tree.primitives[node.primitives[node.primitives.length - 1]] : undefined
  })

export const useConstants = () => useSelector(state => state.tree.present.constants)

export const useVisualState = () => useSelector(state => state.visual)

export const useDimensions = () => useSelector(state => state.visual.dimensions)

export const useTheme = () => useSelector(state => state.visual.theme)

export const useStyles = () => useSelector(state => stylesSelector(state))

export const useStyle = (nodeID: NodeID): NodeStyle | undefined => useStyles()[nodeID]

export const useCoords = () => useSelector(state => coordsSelector(state))

export const useJoins = () => useSelector(state => joinsSelector(state))

export const useTextTree = (rootID?: NodeID) =>
  useSelector(state => textTreeSelector(state)(rootID || state.tree.present.root))

export const useHighlighted = () => useSelector(state => state.visual.highlighted)

export const useSelected = () => useSelector(state => state.visual.selected)

export const useMode = () => useSelector(state => state.visual.animation.mode)

export const useAnimationSettings = () => useSelector(state => state.visual.animation.settings)

export const useAnimationEnabled = () => useSelector(state => state.visual.animation.enabled)

export const useCoord = (nodeID: NodeID): NodeCoord | undefined => useCoords()[nodeID]
