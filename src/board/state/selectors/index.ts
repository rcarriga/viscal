import { coordsSelector } from "../"

import { useBoard } from "./base"

export * from "./coords"
export * from "./styles"

export const useCoords = () => {
  return coordsSelector(useBoard())
}

export const useTree = () => {
  return useBoard().tree
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
