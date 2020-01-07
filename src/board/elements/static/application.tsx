import React from "react"
import { RawExprProps, ExprProps } from "./base"
import { useSelected, useCoords, useColors, useControls } from "../../state"

interface ApplProps extends ExprProps {}

export const Appl = (props: ApplProps) => {
  const coord = useCoords(coords => coords[props.id]),
    control = useControls(controls => controls),
    isSelected = useSelected(selected => props.id === selected),
    strokeColor = isSelected ? "red" : "grey"

  return (
    <RawAppl
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
  const circleTopPoint = props.y - props.radius,
    outPath = `M${props.x + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`

  return (
    <g id={props.id}>
      <path className={props.className} strokeOpacity={0} d={outPath} />
      <path
        className={props.className}
        stroke="grey"
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
