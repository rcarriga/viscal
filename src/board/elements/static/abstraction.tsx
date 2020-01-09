import React from "react"
import { useEvents, useSelected, useCoords, useColor, useControl, useTheme } from "../../state"
import { ExprProps, RawExprProps } from "./base"

interface AbsProps extends ExprProps {
  variableName: string
}

export const Abs = (props: AbsProps) => {
  const color = useColor(props.id)
  const coord = useCoords()[props.id]
  const control = useControl()
  const isSelected = useSelected(selected => props.id === selected)
  const theme = useTheme()
  const strokeColor = isSelected ? theme.selectedStroke : theme.stroke

  return (
    <RawAbs
      events={useEvents()}
      id={props.id}
      x={coord.x}
      y={coord.y}
      width={coord.w}
      radius={control.circleRadius}
      height={coord.h}
      heightMargin={control.heightMargin}
      widthMargin={control.widthMargin}
      strokeWidth={control.strokeWidth}
      strokeColor={strokeColor}
      variableColor={color}
    />
  )
}

interface RawAbsProps extends RawExprProps {
  variableColor: string
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
        {...props.events}
        data-nodeid={props.id}
        className={props.className}
        strokeOpacity={0}
        d={outPath}
      />
      <path
        {...props.events}
        data-nodeid={props.id}
        fill={props.variableColor}
        d={`${inStart} ${inPath} l0,${-props.radius * 2}`}
      />
      <path
        {...props.events}
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
