import React from "react"
import {
  useEvents,
  useSelected,
  useCoords,
  useColor,
  useDimensions,
  useTheme,
  useHighligthed
} from "../../state"
import { ExprProps, RawExprProps } from "./base"

interface AbsProps extends ExprProps {
  variableName: string
}

export const Abs = (props: AbsProps) => {
  const color = useColor(props.id)
  const coord = useCoords()[props.id]
  const dimensions = useDimensions()
  const isSelected = props.id === useSelected()
  const isHighlighted = useHighligthed(props.id, 0)
  const theme = useTheme()
  const strokeColor = isSelected ? theme.selectedStroke : theme.stroke
  const varStrokeColor = theme.highlightedStroke
  const varStrokeOpacity = isHighlighted ? 1 : 0

  return (
    <RawAbs
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
      varColor={color}
      varStroke={varStrokeColor}
      varStrokeOpacity={varStrokeOpacity}
    />
  )
}

interface RawAbsProps extends RawExprProps {
  varColor: string
  varStroke: string
  varStrokeOpacity: number
  radius: number
  height: number
  width: number
  widthMargin: number
  heightMargin: number
  strokeWidth: number
  strokeColor: string
}

const RawAbs = (props: RawAbsProps) => {
  const boxWidth = props.width - props.radius
  const circleTopPoint = props.y - props.radius
  const inputX = props.x + boxWidth + props.radius
  const inStart = `M${inputX},${circleTopPoint}`
  const inPath = `${inStart} a1,1 0 0,0 0,${props.radius * 2}`
  const outPath = `M${props.x + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`

  return (
    <g id={props.id}>
      <path
        onClick={props.events.click}
        onMouseOver={props.events.select}
        data-nodeid={props.id}
        className={props.className}
        strokeOpacity={0}
        d={outPath}
      />
      <path
        onMouseOver={props.events.highlight}
        onMouseLeave={props.events.clearhighlight}
        data-nodeid={props.id}
        fill={props.varColor}
        strokeOpacity={props.varStrokeOpacity}
        stroke={props.varStroke}
        strokeWidth={props.strokeWidth}
        d={`${inStart} ${inPath} l0,${-props.radius * 2}`}
      />
      <path
        onClick={props.events.click}
        onMouseOver={props.events.select}
        data-nodeid={props.id}
        pointerEvents="painted"
        className={props.className}
        stroke={props.strokeColor}
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
        d={`M${props.x + props.radius},${circleTopPoint + props.radius * 2}
          l0,${props.height / 2 - props.radius}
          l${boxWidth},0
          l0,${-props.height / 2 + props.radius}
          a1,1 0 1,1 0,${-props.radius * 2}
          l0,${-props.height / 2 + props.radius}
          l${-boxWidth},0
          l0,${props.height}`}
        fill="transparent"
      />
    </g>
  )
}
