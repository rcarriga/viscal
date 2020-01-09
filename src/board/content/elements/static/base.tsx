import { NodeEvents } from "../../../state"

export interface ExprProps {
  id: string
}
export interface RawExprProps {
  id: string
  x: number
  y: number
  events: NodeEvents
  className?: string
}
