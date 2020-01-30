import React, { useEffect } from "react"
import { useSpring, animated } from "react-spring"

import { useEvents, VarStyle } from "../../state"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  style: VarStyle
}

export const Var = (props: VarProps) => {
  const events = useEvents()
  return (
    <RawVar
      events={events}
      id={props.id}
      nodeID={props.coord.nodeID}
      radius={props.coord.w / 2}
      style={props.style}
      x={props.coord.x}
      y={props.coord.y}
    />
  )
}

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
    ...props.style.stroke
  })
  return (
    <animated.path
      {...animate}
      data-nodeid={props.nodeID}
      id={props.id}
      onClick={props.events.click}
      onMouseOver={props.events.highlight}
      onMouseLeave={props.events.clearHighlight}
    />
  )
}
