import React from "react"
import { useSpring, animated } from "react-spring"
import { useDimensions, useEvents, ApplStyle, useStyle, useCoord } from "../../state"
import { ExprProps, RawExprProps, useMoveTracker } from "./base"

const Appl = (props: ExprProps) => {
  const dimensions = useDimensions()
  const events = useEvents()
  const style = useStyle(props.id)
  const coord = useCoord(props.id)
  if (!style || !coord || style.type !== "APPL_STYLE" ) return null
  return (
    <RawAppl
      id={props.id}
      events={events}
      height={coord.h}
      nodeID={coord.nodeID}
      radius={dimensions.circleRadius}
      style={style}
      width={coord.w}
      x={coord.x}
      y={coord.y}
    >
      {props.children}
    </RawAppl>
  )
}

export default Appl

interface RawApplProps extends RawExprProps {
  radius: number
  width: number
  height: number
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

  const boxAnimate = useSpring({
    d: boxPath,
    fill: props.style.fill,
    ...props.style.stroke,
    ...useMoveTracker()
  })

  return (
    <animated.path
      {...boxAnimate}
      className={props.className}
      data-nodeid={props.nodeID}
      pointerEvents="painted"
      onClick={() => props.events.click(props.id)}
    />
  )
}
