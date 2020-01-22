import { motion, AnimatePresence } from "framer-motion"
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
  return (
    <AnimatePresence>
      {coord && (
        <RawVar
          events={events}
          id={props.id}
          radius={coord.w / 2}
          style={style}
          x={coord.x}
          y={coord.y}
        />
      )}
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
  return (
    <motion.path
      data-nodeid={props.id}
      id={props.id}
      onPan={props.events.drag}
      onClick={props.events.click}
      onMouseOver={props.events.highlight}
      onMouseLeave={props.events.clearHighlight}
      initial={false}
      transition={{ d: { type: "tween" } }}
      exit={{ fill: "rgba(255,255,255,0)" }}
      animate={{
        d: path,
        fill: props.style.fill,
        ...props.style.stroke
      }}
    />
  )
}
