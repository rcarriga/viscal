import React, { useEffect, useState } from "react"
import { useSpring, animated } from "react-spring"
import { useDimensions, useEvents, ApplStyle } from "../../state"
import { ExprProps, RawExprProps, useMoveTracker } from "./base"

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
      id={props.id}
      nodeID={props.coord.nodeID}
      radius={dimensions.circleRadius}
      style={props.style}
      width={props.coord.w}
      x={props.coord.x}
      y={props.coord.y}
    >
      {props.children}
    </RawAppl>
  )
}

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
    ...useMoveTracker(props)
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
