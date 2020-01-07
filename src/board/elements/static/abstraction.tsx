import React from "react"
import { ExprProps } from "./base"

interface AbsProps extends ExprProps {
  height: number
  width: number
  widthMargin: number
  heightMargin: number
  strokeWidth: number
}

export const Abs = (props: AbsProps) => {
  const boxWidth = props.width - props.radius
  const circleTopPoint = props.y - props.radius
  const inputX = props.x + boxWidth + props.radius
  const inStart = `M${inputX},${circleTopPoint}`
  const inPath = `${inStart} a1,1 0 0,0 0,${props.radius * 2}`
  const outPath = `M${props.x + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`

  return (
    <g id={props.id}>
      <path className={props.className} strokeOpacity={0} d={outPath} />
      <path
        onClick={console.log}
        pointerEvents="painted"
        className={props.className}
        stroke="grey"
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

