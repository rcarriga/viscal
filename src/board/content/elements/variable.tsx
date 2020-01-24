import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import { VarName, useVarStyle, useCoords, useEvents, VarStyle } from "../../state"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  variableName: VarName
}

export const Var = (props: VarProps) => {
  const style = useVarStyle(props.coord.nodeID)
  const events = useEvents()
  return (
    <AnimatePresence>
      <RawVar
        events={events}
        id={props.id}
        nodeID={props.coord.nodeID}
        radius={props.coord.w / 2}
        style={style}
        x={props.coord.x}
        y={props.coord.y}
      />
    </AnimatePresence>
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
  const animate = {
    d: path,
    fill: props.style.fill,
    ...props.style.stroke
  }
  return (
    <motion.path
      data-nodeid={props.nodeID}
      id={props.id}
      onPan={props.events.drag}
      onClick={props.events.click}
      onMouseOver={props.events.highlight}
      onMouseLeave={props.events.clearHighlight}
      initial={{ ...animate, fill: "rgba(255,255,255,0)" }}
      transition={props.style.animation.transition}
      exit={{ fill: "rgba(255,255,255,0)" }}
      animate={animate}
    />
  )
}
