import React from "react"
import { useSpring, useTransition, animated } from "react-spring"

import { useEvents, VarStyle, useStyle, useCoord } from "../../state"
import { RawExprProps, useMoveTracker, ExprProps } from "./base"

const Var = (props: ExprProps) => {
  const events = useEvents()
  const style = useStyle(props.id)
  const coord = useCoord(props.id)
  if (!style || !coord || style.type !== "VAR_STYLE") return null
  return (
    <RawVar
      events={events}
      id={props.id}
      nodeID={coord.nodeID}
      radius={coord.w / 2}
      style={style}
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

  const animate = useSpring({
    d: path,
    fill: props.style.fill,
    ...props.style.stroke,
    ...useMoveTracker()
  })
  return (
    <animated.path
      {...animate}
      id={props.id}
      data-nodeid={props.nodeID}
      onClick={() => props.events.click(props.id)}
      onMouseOver={() => props.events.highlight(props.id)}
      onMouseLeave={() => props.events.clearHighlight(props.id)}
    />
  )
}
