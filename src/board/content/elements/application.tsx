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
  const boxWidth = props.width
  const offsetWidth = props.height / 2
  const boxPath = `M${props.x},${props.y}
          l${offsetWidth},${props.height / 2}
          l${boxWidth - offsetWidth * 2},0
          l${offsetWidth},${-props.height / 2}
          l${-offsetWidth},${-props.height / 2}
          l${offsetWidth * 2 - boxWidth},0
          l${-offsetWidth},${props.height / 2}`

  const boxAnimate = useMotion(
    {
      d: boxPath,
      fill: props.style.fill,
      ...props.style.stroke
    },
    props.rest,
    props.start
  )

  return (
    <animated.path
      {...boxAnimate}
      strokeLinecap="round"
      pointerEvents="painted"
      onClick={() => props.events.click(props.id)}
    />
  )
}
