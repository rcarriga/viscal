import React from "react"
import { animated } from "react-spring"
import { useDimensions, useEvents, AbsStyle, useStyle, useCoord } from "../../state"
import { ExprProps, RawExprProps, useMotion } from "./base"

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
      radius={dimensions.circleRadius}
      style={style}
      width={coord.w}
      widthMargin={dimensions.widthMargin}
      rest={props.rest}
      start={props.start}
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
  const outPath = `M${props.x + 2 + props.radius},${circleTopPoint}
        a1,1 0 0,0 0,${props.radius * 2}`
  const inPath = `M${inputX + 2},${circleTopPoint}
        a1,1 0 0,0 0,${props.radius * 2}
        l0,${-props.radius * 2}`
  const circleBuffer = props.height / 2 - props.radius
  const boxPath = `M${props.x + props.radius},${circleTopPoint + props.radius * 2}
        l${props.heightMargin},${circleBuffer}
        l${boxWidth - props.heightMargin * 2},0
        l${props.heightMargin},${-circleBuffer}
        a1,1 0 1,1 0,${-props.radius * 2}
        l${-props.heightMargin},${-circleBuffer}
        l${props.heightMargin * 2 - boxWidth},0
        l${-props.heightMargin},${circleBuffer}`

  const surroundAnimate = useMotion({
    x: props.x,
    y: props.y - props.radius,
    height: props.radius * 2 + 5,
    width: props.radius * 2 + 5
  })
  const outAnimate = useMotion(
    {
      d: outPath,
      fill: props.style.output.fill,
      ...props.style.output.stroke
    },
    props.rest,
    props.start
  )
  const inAnimate = useMotion(
    {
      d: inPath,
      fill: props.style.input.fill,
      ...props.style.input.stroke
    },
    props.rest,
    props.start
  )
  const boxAnimate = useMotion({ d: boxPath, fill: props.style.fill, ...props.style.stroke }, props.rest, props.start)

  return (
    <animated.g id={props.id}>
      <animated.g {...surroundAnimate} style={{ filter: "url(#goo))" }}>
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
          {...inAnimate}
          onClick={e => {
            e.stopPropagation()
            props.events.click(props.id)
          }}
          onMouseOver={() => props.events.highlight(props.id)}
          onMouseLeave={() => props.events.clearHighlight(props.id)}
        />
      </animated.g>
      <animated.path {...boxAnimate} onClick={() => props.events.click(props.id)} pointerEvents="stroke" />
    </animated.g>
  )
}
