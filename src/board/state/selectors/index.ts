import { coordsSelector, NodeCoord } from "../"

import { NodeID } from "../tree"
import { useBoard } from "./base"

export * from "./coords"
export * from "./styles"

export const useCoord: (nodeID: NodeID) => NodeCoord | undefined = (nodeID: NodeID) => {
  const layout = useBoard().visual.treeLayout
  const coord = coordsSelector(useBoard())[nodeID]
  if (coord) return { ...coord, x: coord.x + layout.startX, y: coord.y + layout.startY }
}

export const useEvents = () => {
  return useBoard().visual.events
}

export const useDimensions = () => {
  return useBoard().visual.dimensions
}
