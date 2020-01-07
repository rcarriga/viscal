import React from "react"
import { ExprProps, RawExprProps } from "./base"
import { useSelected, useCoords, useColors, useControls } from "../../state"

interface AbsProps extends ExprProps {
  variableName: string
}

export const Abs = (props: AbsProps) => {
  const color = useColors(colors => colors[props.id] || "black"),
    coord = useCoords(coords => coords[props.id]),
    control = useControls(controls => controls),
    isSelected = useSelected(selected => props.id === selected),
    strokeColor = isSelected ? "red" : "grey"

  return (
    <RawAbs
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
  const boxWidth = props.width - props.radius,
    circleTopPoint = props.y - props.radius,
    inputX = props.x + boxWidth + props.radius,
    inStart = `M${inputX},${circleTopPoint}`,
    inPath = `${inStart} a1,1 0 0,0 0,${props.radius * 2}`,
    outPath = `M${props.x + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`

  return (
    <g id={props.id}>
      <path className={props.className} strokeOpacity={0} d={outPath} />
      <path
        onClick={console.log}
        pointerEvents="painted"
        className={props.className}
        stroke={props.strokeColor}
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
        d={`M${props.x + props.radius},${circleTopPoint + props.radius * 2}
          l0,${props.height / 2 - props.radius}
          l${boxWidth},0
          l0,${-props.height / 2 + props.radius}
          ${inPath}
          ${inStart}
          l0,${-props.height / 2 + props.radius}
          l${-boxWidth},0
          l0,${props.height}`}
        fill="transparent"
      />
    </g>
  )
}
