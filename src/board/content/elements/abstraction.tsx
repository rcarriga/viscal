import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import { useDimensions, useEvents, AbsStyle } from "../../state"
import { ExprProps, RawExprProps } from "./base"

interface AbsProps extends ExprProps {
  style: AbsStyle
}

export const Abs = (props: AbsProps) => {
  const dimensions = useDimensions()
  const events = useEvents()

  return (
    <AnimatePresence>
      <RawAbs
        events={events}
        height={props.coord.h}
        heightMargin={dimensions.heightMargin}
        id={props.id}
        nodeID={props.coord.nodeID}
        radius={dimensions.circleRadius}
        style={props.style}
        width={props.coord.w}
        widthMargin={dimensions.widthMargin}
        x={props.coord.x}
        y={props.coord.y}
      />
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

  const outAnimate = { d: outPath, fill: props.style.output.fill, ...props.style.output.stroke }
  const inAnimate = { d: inPath, fill: props.style.input.fill, ...props.style.input.stroke }
  const boxAnimate = { d: boxPath, fill: props.style.fill, ...props.style.stroke }

  return (
    <motion.g initial={{ opacity: 1 }} exit={{ opacity: 0 }} id={props.id}>
      <motion.path
        className={props.className}
        animate={outAnimate}
        transition={props.style.animation.transition}
        initial={{ ...outAnimate, fill: "rgba(255,255,255,0)" }}
        exit={{ fill: "rgba(255,255,255,0)" }}
        data-nodeid={props.nodeID}
        onClick={props.events.click}
        onMouseOver={props.events.highlight}
        onPan={props.events.drag}
      />
      <motion.path
        data-nodeid={props.nodeID}
        initial={{ ...inAnimate, fill: "rgba(255,255,255,0)" }}
        animate={inAnimate}
        transition={props.style.animation.transition}
        onMouseOver={props.events.highlight}
        onMouseLeave={props.events.clearHighlight}
        onPan={props.events.drag}
        onTransitionEndCapture={console.log}
      />
      <motion.path
        className={props.className}
        data-nodeid={props.nodeID}
        transition={props.style.animation.transition}
        initial={{ ...boxAnimate, stroke: "rgba(255,255,255,0)" }}
        exit={{ stroke: "rgba(255,255,255,0)" }}
        animate={boxAnimate}
        onClick={props.events.click}
        pointerEvents="painted"
        onPan={props.events.drag}
      />
    </motion.g>
  )
}
