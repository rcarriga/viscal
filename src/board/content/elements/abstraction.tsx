import { motion } from "framer-motion"
import React from "react"
import { useAbsStyle, useCoords, useDimensions, useEvents, useLayout, AbsStyle } from "../../state"
import { ExprProps, RawExprProps } from "./base"

interface AbsProps extends ExprProps {
  variableName: string
}

export const Abs = (props: AbsProps) => {
  const { startX, startY } = useLayout()
  const coord = useCoords()[props.id]
  const dimensions = useDimensions()
  const style = useAbsStyle(props.id)

  return (
    <RawAbs
      events={useEvents()}
      height={coord.h}
      heightMargin={dimensions.heightMargin}
      id={props.id}
      radius={dimensions.circleRadius}
      style={style}
      width={coord.w}
      widthMargin={dimensions.widthMargin}
      x={startX + coord.x}
      y={startY + coord.y}
    />
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
    <g id={props.id}>
      <motion.path
        className={props.className}
        animate={{ d: outPath, color: props.style.output.fill, ...props.style.output.stroke }}
        initial={false}
        data-nodeid={props.id}
        onClick={props.events.click}
        onMouseOver={props.events.highlight}
      />
      <motion.path
        data-nodeid={props.id}
        initial={false}
        animate={{
          d: inPath,
          fill: props.style.input.fill,
          ...props.style.input.stroke
        }}
        onMouseOver={props.events.highlight}
        onMouseLeave={props.events.clearHighlight}
      />
      <motion.path
        className={props.className}
        data-nodeid={props.id}
        initial={false}
        animate={{
          d: boxPath,
          fill: props.style.fill,
          ...props.style.stroke
        }}
        onClick={props.events.click}
        pointerEvents="painted"
      />
    </g>
  )
}
