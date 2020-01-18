import { motion } from "framer-motion"
import React from "react"
import { VarName, useVarStyle, useCoord, useEvents, VarStyle } from "../../state"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  variableName: VarName
}

export const Var = (props: VarProps) => {
  const coord = useCoord(props.id)
  const style = useVarStyle(props.id)
  const events = useEvents()
  if (coord)
    return (
      <RawVar
        events={events}
        id={props.id}
        radius={coord.w / 2}
        style={style}
        x={coord.x}
        y={coord.y}
      />
    )
  return null
}

interface RawVarProps extends RawExprProps {
  radius: number
  style: VarStyle
}

const RawVar = (props: RawVarProps) => {
  const path = `M${props.x},${props.y}
      a${props.radius},${props.radius} 0 1,0 ${props.radius * 2},0
      a${props.radius},${props.radius} 0 1,0 -${props.radius * 2},0`
  return (
    <motion.path
      data-nodeid={props.id}
      id={props.id}
      onClick={props.events.click}
      onMouseOver={props.events.highlight}
      onMouseLeave={props.events.clearHighlight}
      initial={false}
      animate={{
        d: path,
        pathLength: 1,
        fill: props.style.fill,
        ...props.style.stroke
      }}
    />
  )
}
