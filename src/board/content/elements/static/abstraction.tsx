import React from "react"
import {
  useColor,
  useCoords,
  useDimensions,
  useEvents,
  useHighligthed,
  useSelected,
  useTheme,
  useLayout
} from "../../../state"
import { ExprProps, RawExprProps } from "./base"

interface AbsProps extends ExprProps {
  variableName: string
}

export const Abs = (props: AbsProps) => {
  const coord = useCoords()[props.id]
  const dimensions = useDimensions()
  const theme = useTheme()
  const strokeColor = useHighligthed(props.id) ? theme.highlightedStroke : theme.stroke

  return (
    <RawAbs
      events={useEvents()}
      height={coord.h}
      heightMargin={dimensions.heightMargin}
      id={props.id}
      radius={dimensions.circleRadius}
      strokeColor={strokeColor}
      strokeWidth={dimensions.strokeWidth}
      varColor={useColor(props.id)}
      varStroke={theme.highlightedStroke}
      varStrokeOpacity={useHighligthed(props.id) ? 1 : 0}
      width={coord.w}
      widthMargin={dimensions.widthMargin}
      x={coord.x}
      y={coord.y}
    />
  )
}

interface RawAbsProps extends RawExprProps {
  height: number
  heightMargin: number
  radius: number
  strokeColor: string
  strokeWidth: number
  varColor: string
  varStroke: string
  varStrokeOpacity: number
  width: number
  widthMargin: number
}

const RawAbs = (props: RawAbsProps) => {
  const baseX = useLayout().startX + props.x
  const baseY = useLayout().startY + props.y
  const boxWidth = props.width - props.radius
  const circleTopPoint = baseY - props.radius
  const inputX = baseX + boxWidth + props.radius
  const inStart = `M${inputX},${circleTopPoint}`
  const inPath = `${inStart} a1,1 0 0,0 0,${props.radius * 2}`
  const outPath = `M${baseX + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`

  return (
    <g id={props.id}>
      <path
        className={props.className}
        d={outPath}
        data-nodeid={props.id}
        onClick={props.events.click}
        onMouseOver={props.events.highlight}
        strokeOpacity={0}
      />
      <path
        d={`${inStart} ${inPath} l0,${-props.radius * 2}`}
        data-nodeid={props.id}
        fill={props.varColor}
        onMouseOver={props.events.highlight}
        stroke={props.varStroke}
        strokeOpacity={props.varStrokeOpacity}
        strokeWidth={props.strokeWidth}
      />
      <path
        className={props.className}
        d={`M${baseX + props.radius},${circleTopPoint + props.radius * 2}
          l0,${props.height / 2 - props.radius}
          l${boxWidth},0
          l0,${-props.height / 2 + props.radius}
          a1,1 0 1,1 0,${-props.radius * 2}
          l0,${-props.height / 2 + props.radius}
          l${-boxWidth},0
          l0,${props.height}`}
        data-nodeid={props.id}
        fill="transparent"
        onClick={props.events.click}
        onMouseOver={props.events.highlight}
        pointerEvents="painted"
        stroke={props.strokeColor}
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
      />
    </g>
  )
}
