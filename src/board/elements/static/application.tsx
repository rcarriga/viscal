import React from "react"
import { useDimensions, useCoords, useSelected, useTheme, useEvents } from "../../state"
import { ExprProps, RawExprProps } from "./base"

interface ApplProps extends ExprProps {}

export const Appl = (props: ApplProps) => {
  const coord = useCoords()[props.id]
  const dimensions = useDimensions()
  const isSelected = props.id === useSelected()
  const theme = useTheme()
  const strokeColor = isSelected ? theme.selectedStroke : theme.stroke

  return (
    <RawAppl
      events={useEvents()}
      id={props.id}
      x={coord.x}
      y={coord.y}
      width={coord.w}
      radius={dimensions.circleRadius}
      height={coord.h}
      heightMargin={dimensions.heightMargin}
      widthMargin={dimensions.widthMargin}
      strokeWidth={dimensions.strokeWidth}
      strokeColor={strokeColor}
    />
  )
}

interface RawApplProps extends RawExprProps {
  radius: number
  height: number
  width: number
  widthMargin: number
  heightMargin: number
  strokeWidth: number
  strokeColor: string
}

const RawAppl = (props: RawApplProps) => {
  const circleTopPoint = props.y - props.radius
  const outPath = `M${props.x + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`

  return (
    <g id={props.id}>
      <path
        data-nodeid={props.id}
        onClick={props.events.click}
        onMouseOver={props.events.select}
        className={props.className}
        strokeOpacity={0}
        d={outPath}
      />
      <path
        data-nodeid={props.id}
        onClick={props.events.click}
        onMouseOver={props.events.select}
        className={props.className}
        stroke={props.strokeColor}
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
        d={`M${props.x + props.radius},${circleTopPoint + props.radius * 2}
          l0,${props.height / 2 - props.radius}
          l${props.width},0
          l0,${-props.height}
          l${-props.width},0
          l0,${props.height}`}
        fillOpacity="0"
      />
    </g>
  )
}
