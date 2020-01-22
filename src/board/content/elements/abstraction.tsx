import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import { useAbsStyle, useCoord, useDimensions, useEvents, AbsStyle } from "../../state"
import { ExprProps, RawExprProps } from "./base"

interface AbsProps extends ExprProps {
  variableName: string
}

export const Abs = (props: AbsProps) => {
  const coord = useCoord(props.id)
  const dimensions = useDimensions()
  const style = useAbsStyle(props.id)
  const events = useEvents()

  return (
    <AnimatePresence>
      {coord && (
        <RawAbs
          events={events}
          height={coord.h}
          heightMargin={dimensions.heightMargin}
          id={props.id}
          radius={dimensions.circleRadius}
          style={style}
          width={coord.w}
          widthMargin={dimensions.widthMargin}
          x={coord.x}
          y={coord.y}
        />
      )}
    </AnimatePresence>
  )
}

interface RawAbsProps extends RawExprProps {
  height: number
  heightMargin: number
  radius: number
  style: AbsStyle
  width: number
  widthMargin: number
}

const RawAbs = (props: RawAbsProps) => {
  const boxWidth = props.width - props.radius
  const circleTopPoint = props.y - props.radius
  const inputX = props.x + boxWidth + props.radius
  const outPath = `M${props.x + props.radius},${circleTopPoint}
        a1,1 0 0,0 0,${props.radius * 2}`
  const inPath = `M${inputX},${circleTopPoint}
        a1,1 0 0,0 0,${props.radius * 2}
        l0,${-props.radius * 2}`
  const boxPath = `M${props.x + props.radius},${circleTopPoint + props.radius * 2}
        l0,${props.height / 2 - props.radius}
        l${boxWidth},0
        l0,${-props.height / 2 + props.radius}
        a1,1 0 1,1 0,${-props.radius * 2}
        l0,${-props.height / 2 + props.radius}
        l${-boxWidth},0
        l0,${props.height}`

  return (
    <motion.g initial={{ opacity: 1 }} exit={{ opacity: 0 }} id={props.id}>
      <motion.path
        className={props.className}
        animate={{ d: outPath, color: props.style.output.fill, ...props.style.output.stroke }}
        transition={{ d: { type: "tween" } }}
        initial={false}
        data-nodeid={props.id}
        onClick={props.events.click}
        onMouseOver={props.events.highlight}
        onPan={props.events.drag}
      />
      <motion.path
        data-nodeid={props.id}
        initial={false}
        animate={{
          d: inPath,
          fill: props.style.input.fill,
          ...props.style.input.stroke
        }}
        transition={{ d: { type: "tween" } }}
        onMouseOver={props.events.highlight}
        onMouseLeave={props.events.clearHighlight}
        onPan={props.events.drag}
        onTransitionEndCapture={console.log}
      />
      <motion.path
        className={props.className}
        data-nodeid={props.id}
        initial={false}
        transition={{ d: { type: "tween" } }}
        animate={{
          d: boxPath,
          fill: props.style.fill,
          ...props.style.stroke
        }}
        onClick={props.events.click}
        pointerEvents="painted"
        onPan={props.events.drag}
      />
    </motion.g>
  )
}
