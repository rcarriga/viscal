import React from "react"
import { animated } from "react-spring"
import { useDimensions, useEvents, ApplStyle, useStyle, useCoord } from "../../state"
import { ExprProps, RawExprProps, useMotion } from "./base"

const Appl = (props: ExprProps) => {
  const dimensions = useDimensions()
  const events = useEvents()
  const style = useStyle(props.id)
  const coord = useCoord(props.id)
  if (!style || !coord || style.type !== "APPL_STYLE") return null
  return (
    <RawAppl
      id={props.id}
      events={events}
      height={coord.h}
      radius={dimensions.circleRadius}
      rest={props.rest}
      start={props.start}
      style={style}
      width={coord.w}
      x={coord.x}
      y={coord.y}
    />
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
  const boxPath = `M${props.x},${circleTopPoint + props.radius * 2}
          l0,${props.height / 2 - props.radius}
          l${boxWidth},0
          l0,${-props.height}
          l${-boxWidth},0
          l0,${props.height}`

  const boxAnimate = useMotion(
    {
      d: boxPath,
      fill: props.style.fill,
      ...props.style.stroke
    },
    props.rest,
    props.start
  )

  return <animated.path {...boxAnimate} pointerEvents="painted" onClick={() => props.events.click(props.id)} />
}
