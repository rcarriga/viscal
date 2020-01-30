import React, { useEffect } from "react"
import { useSpring, animated } from "react-spring"
import { useDimensions, useEvents, AbsStyle } from "../../state"
import { ExprProps, RawExprProps } from "./base"

interface AbsProps extends ExprProps {
  style: AbsStyle
}

export const Abs = (props: AbsProps) => {
  const dimensions = useDimensions()
  const events = useEvents()

  return (
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

  const outAnimate = useSpring({ d: outPath, fill: props.style.output.fill, ...props.style.output.stroke })
  const inAnimate = useSpring({ d: inPath, fill: props.style.input.fill, ...props.style.input.stroke })
  const boxAnimate = useSpring({ d: boxPath, fill: props.style.fill, ...props.style.stroke })

  return (
    <animated.g id={props.id}>
      <animated.path
        {...outAnimate}
        className={props.className}
        data-nodeid={props.nodeID}
        onClick={props.events.click}
        onMouseOver={props.events.highlight}
      />
      <animated.path
        {...inAnimate}
        data-nodeid={props.nodeID}
        x={props.x}
        y={props.y}
        onMouseOver={props.events.highlight}
        onMouseLeave={props.events.clearHighlight}
      />
      <animated.path
        {...boxAnimate}
        className={props.className}
        x={props.x}
        y={props.y}
        data-nodeid={props.nodeID}
        onClick={props.events.click}
        pointerEvents="painted"
      />
    </animated.g>
  )
}
