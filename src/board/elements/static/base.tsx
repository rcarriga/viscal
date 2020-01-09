import { MouseEventHandler } from "../../state"

export interface ExprProps {
  id: string
}
export interface RawExprProps {
  id: string
  x: number
  y: number
  events: {
    onMouseOver?: MouseEventHandler
    onMouseLeave?: MouseEventHandler
    onClick?: MouseEventHandler
  }
  className?: string
}
