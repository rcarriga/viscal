import { coordsSelector, NodeCoord } from "../"

import { NodeID } from "../tree"
import { useBoard } from "./base"
import { Coords } from "./coords"

export * from "./coords"
export * from "./styles"

export const useCoords = (): Coords => {
  const state = useBoard()
  return coordsSelector(state)
}

export const useEvents = () => {
  return useBoard().visual.events
}

export const useDimensions = () => {
  return useBoard().visual.dimensions
}
