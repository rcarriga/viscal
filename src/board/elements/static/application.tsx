import React from "react"
import { ExprProps } from "./base"

interface ApplProps extends ExprProps {
  height: number
  width: number
  widthMargin: number
  heightMargin: number
  strokeWidth: number
}
export const Appl = (props: ApplProps) => {
  const circleTopPoint = props.y - props.radius
  const outPath = `M${props.x + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`

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
