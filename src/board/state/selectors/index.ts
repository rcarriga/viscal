import { AppState } from "../../../state"
import { ControlState, coordsSelector, Coords, VarColors } from "../../state"
import { useSelector, TypedUseSelectorHook } from "react-redux"

export * from "./coords"

export const typedSelector: TypedUseSelectorHook<AppState> = useSelector

export const useColors: TypedUseSelectorHook<VarColors> = callback => {
  return typedSelector(state => callback(state.board.visual.colors))
}

export const useSelected: TypedUseSelectorHook<string | undefined> = callback => {
  return typedSelector(state => callback(state.board.visual.selected))
}

export const useCoords: TypedUseSelectorHook<Coords> = callback => {
  return typedSelector(state => callback(coordsSelector(state.board)))
}

export const useControls: TypedUseSelectorHook<ControlState> = callback => {
  return typedSelector(state => callback(state.board.control))
}
