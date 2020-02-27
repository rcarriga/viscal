import { NodeEvents } from "board/state"
import { useState } from "react"
import { useSpring } from "react-spring"

export interface ExprProps {
  id: string
  rest: (symbol: symbol) => void
  start: (symbol: symbol) => void
}

export interface RawExprProps extends ExprProps {
  x: number
  y: number
  events: NodeEvents
}

export const useMotion = (props: any, rest: (symbol: symbol) => void, start: (symbol: symbol) => void) => {
  const [sym] = useState(Symbol(""))
  return useSpring({
    to: props,
    config: {
      tension: 100,
      clamp: true
    },
    onRest: () => rest(sym),
    onStart: () => start(sym)
  })
}
