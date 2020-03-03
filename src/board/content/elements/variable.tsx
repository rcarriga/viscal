import React from "react"
import { animated } from "react-spring"

import { useEvents, VarStyle, useStyle, useCoord } from "../../state"
import { RawExprProps, useMotion, ExprProps } from "./base"

const Var = (props: ExprProps) => {
  const events = useEvents()
  const style = useStyle(props.id)
  const coord = useCoord(props.id)
  if (!style || !coord || style.type !== "VAR_STYLE") return null
  return (
    <RawVar
      events={events}
      id={props.id}
      radius={coord.w / 2}
      style={style}
      rest={props.rest}
      start={props.start}
      x={coord.x}
      y={coord.y}
    />
  )
}

export default Var

interface RawVarProps extends RawExprProps {
  radius: number
  style: VarStyle
}

const RawVar = (props: RawVarProps) => {
  const path = `M${props.x},${props.y}
      a${props.radius},${props.radius} 0 1,0 ${props.radius * 2},0
      a${props.radius},${props.radius} 0 1,0 -${props.radius * 2},0`

  const animate = useMotion(
    {
      d: path,
      fill: props.style.fill,
      ...props.style.stroke
    },
    props.rest,
    props.start
  )
  return (
    <animated.path
      {...animate}
      id={props.id}
      onClick={e => {
        e.stopPropagation()
        props.events.click(props.id)
      }}
      onMouseOver={() => props.events.highlight(props.id)}
      onMouseLeave={() => props.events.clearHighlight(props.id)}
    />
  )
}
