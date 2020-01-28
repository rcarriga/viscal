import { motion } from "framer-motion"
import React from "react"
import { useDimensions, useEvents, ApplStyle } from "../../state"
import { ExprProps, RawExprProps } from "./base"

interface ApplProps extends ExprProps {
  style: ApplStyle
}

export const Appl = (props: ApplProps) => {
  const dimensions = useDimensions()
  const events = useEvents()

  return (
    <RawAppl
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
    >
      {props.children}
    </RawAppl>
  )
}

interface RawApplProps extends RawExprProps {
  height: number
  heightMargin: number
  radius: number
  width: number
  widthMargin: number
  style: ApplStyle
}

const RawAppl = (props: RawApplProps) => {
  const boxWidth = props.width - props.radius
  const circleTopPoint = props.y - props.radius
  const boxPath = `M${props.x + props.radius},${circleTopPoint + props.radius * 2}
          l0,${props.height / 2 - props.radius}
          l${boxWidth},0
          l0,${-props.height}
          l${-boxWidth},0
          l0,${props.height}`
  const boxAnimate = { d: boxPath, fill: props.style.fill, ...props.style.stroke }

  return (
    <g id={props.id}>
      <motion.path
        className={props.className}
        transition={props.style.animation.transition}
        initial={{ ...boxAnimate, stroke: "rgba(255,255,255,0)" }}
        animate={boxAnimate}
        data-nodeid={props.nodeID}
        pointerEvents="painted"
        onClick={props.events.click}
        onPan={props.events.drag}
      />
    </g>
  )
}
