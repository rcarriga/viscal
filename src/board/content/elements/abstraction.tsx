import React from "react"
import { useSpring, animated } from "react-spring"
import { useDimensions, useEvents, AbsStyle, useStyle, useCoord } from "../../state"
import { ExprProps, RawExprProps, useMoveTracker } from "./base"

const Abs = (props: ExprProps) => {
  const dimensions = useDimensions()
  const events = useEvents()
  const style = useStyle(props.id)
  const coord = useCoord(props.id)
  if (!style || !coord || style.type !== "ABS_STYLE") return null
  return (
    <RawAbs
      id={props.id}
      events={events}
      height={coord.h}
      heightMargin={dimensions.heightMargin}
      nodeID={coord.nodeID}
      radius={dimensions.circleRadius}
      style={style}
      width={coord.w}
      widthMargin={dimensions.widthMargin}
      x={coord.x}
      y={coord.y}
    />
  )
}

export default Abs

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

  const commonAnimateConf = useMoveTracker()
  const outAnimate = useSpring({
    d: outPath,
    fill: props.style.output.fill,
    ...props.style.output.stroke,
    ...commonAnimateConf
  })
  const inAnimate = useSpring({
    d: inPath,
    fill: props.style.input.fill,
    ...props.style.input.stroke,
    ...commonAnimateConf
  })
  const boxAnimate = useSpring({ d: boxPath, fill: props.style.fill, ...props.style.stroke, ...commonAnimateConf })

  return (
    <animated.g id={props.id}>
      <animated.path
        {...outAnimate}
        className={props.className}
        data-nodeid={props.nodeID}
        onClick={() => props.events.click(props.id)}
        onMouseOver={() => props.events.highlight(props.id)}
        onMouseLeave={() => props.events.clearHighlight(props.id)}
      />
      <animated.path
        {...inAnimate}
        data-nodeid={props.nodeID}
        x={props.x}
        y={props.y}
        onMouseOver={() => props.events.highlight(props.id)}
        onMouseLeave={() => props.events.clearHighlight(props.id)}
      />
      <animated.path
        {...boxAnimate}
        className={props.className}
        x={props.x}
        y={props.y}
        data-nodeid={props.nodeID}
        onClick={() => props.events.click(props.id)}
        pointerEvents="painted"
      />
    </animated.g>
  )
}
