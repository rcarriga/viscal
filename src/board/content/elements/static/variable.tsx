import { motion } from "framer-motion"
import React from "react"
import {
  VarName,
  useVarStyle,
  useCoords,
  useDimensions,
  useEvents,
  useLayout
} from "../../../state"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  variableName: VarName
}

export const Var = (props: VarProps) => {
  const coord = useCoords()[props.id]
  const style = useVarStyle(props.id)
  const { startX, startY } = useLayout()

  return (
    <RawVar
      color={style.fill}
      events={useEvents()}
      id={props.id}
      radius={useDimensions().circleRadius}
      {...style.stroke}
      x={startX + coord.x}
      y={startY + coord.y}
    />
  )
}

interface RawVarProps extends RawExprProps {
  color: string
  radius: number
  stroke: string
  strokeOpacity: number
  strokeWidth: number
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
        fill: props.color,
        strokeOpacity: props.strokeOpacity,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke
      }}
      onTransitionEnd={console.log}
    />
  )
}
