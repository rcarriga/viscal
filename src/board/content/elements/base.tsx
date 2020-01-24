import { NodeEvents, NodeCoord, NodeID } from "../../state"

export interface ExprProps {
  id: string
  coord: NodeCoord
  children?: any
}
export interface RawExprProps {
  id: string
  nodeID: NodeID
  x: number
  y: number
  events: NodeEvents
  className?: string
  children?: any
}
