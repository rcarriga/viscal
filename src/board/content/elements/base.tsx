import { NodeEvents, useAnimationSettings, useAnimationEnabled } from "board/state"
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

export const useMotion = (
  props: any,
  rest: (symbol: symbol) => void = () => {},
  start: (symbol: symbol) => void = () => {}
) => {
  const [sym] = useState(Symbol(""))
  const config = useAnimationSettings()
  const enabled = useAnimationEnabled()
  const spring = useSpring({
    to: props,
    config,
    onRest: () => rest(sym),
    onStart: () => start(sym)
  })
  return enabled ? spring : props
}
