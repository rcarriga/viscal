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
      heightMargin={dimensions.heightMargin}
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
  heightMargin: number
  width: number
  height: number
  style: ApplStyle
}

const RawAppl = (props: RawApplProps) => {
  const boxWidth = props.width - props.radius
  const bufferOffset = 1
  const circleBuffer = props.height / 2 - props.radius - bufferOffset
  const outPath = `M${props.x + props.radius},${props.y - props.radius}
        a1,1 0 0,0 0,${props.radius * 2}`
  const boxPath = `M${props.x + props.radius},${props.y + props.radius}
        l0,${bufferOffset}
        l${props.heightMargin},${circleBuffer}
        l${boxWidth - props.heightMargin * 2},0
        l${props.heightMargin},${-circleBuffer}
        l0,${-bufferOffset}
        l0,${-props.radius * 2}
        l0,${-bufferOffset}
        l${-props.heightMargin},${-circleBuffer}
        l${props.heightMargin * 2 - boxWidth},0
        l${-props.heightMargin},${circleBuffer}
        l0,${bufferOffset + props.radius * 2}`

  const boxAnimate = useMotion(
    {
      d: boxPath,
      fill: props.style.fill,
      ...props.style.stroke
    },
    props.rest,
    props.start
  )
  const outAnimate = useMotion(
    {
      d: outPath,
      fill: props.style.output.fill,
      ...props.style.output.stroke
    },
    props.rest,
    props.start
  )

  return (
    <g>
      <animated.path
        {...outAnimate}
        onClick={e => {
          e.stopPropagation()
          props.events.click(props.id)
        }}
        onMouseOver={() => props.events.highlight(props.id)}
        onMouseLeave={() => props.events.clearHighlight(props.id)}
      />
      <animated.path
        {...boxAnimate}
        strokeLinecap="round"
        pointerEvents="stroke"
        onClick={() => props.events.click(props.id)}
        onMouseOver={() => props.events.highlight(props.id)}
        onMouseLeave={() => props.events.clearHighlight(props.id)}
      />
    </g>
  )
}
