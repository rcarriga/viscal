import React from "react"
import {
  useDimensions,
  useCoords,
  useSelected,
  useTheme,
  useEvents,
  useLayout
} from "../../../state"
import { ExprProps, RawExprProps } from "./base"

interface ApplProps extends ExprProps {}

export const Appl = (props: ApplProps) => {
  const coord = useCoords()[props.id]
  const dimensions = useDimensions()
  const theme = useTheme()

  return (
    <RawAppl
      events={useEvents()}
      height={coord.h}
      heightMargin={dimensions.heightMargin}
      id={props.id}
      radius={dimensions.circleRadius}
      strokeColor={props.id === useSelected() ? theme.selectedStroke : theme.stroke}
      strokeWidth={dimensions.strokeWidth}
      width={coord.w}
      widthMargin={dimensions.widthMargin}
      x={coord.x}
      y={coord.y}
    />
  )
}

interface RawApplProps extends RawExprProps {
  height: number
  heightMargin: number
  radius: number
  strokeColor: string
  strokeWidth: number
  width: number
  widthMargin: number
}

const RawAppl = (props: RawApplProps) => {
  const baseX = useLayout().startX + props.x
  const baseY = useLayout().startY + props.y
  const boxWidth = props.width - props.radius
  const circleTopPoint = baseY - props.radius
  const outPath = `M${baseX + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`

  return (
    <g id={props.id}>
      <path
        className={props.className}
        d={outPath}
        data-nodeid={props.id}
        onClick={props.events.click}
        onMouseOver={props.events.select}
        onMouseLeave={props.events.clearSelect}
        strokeOpacity={0}
      />
      <path
        className={props.className}
        d={`M${baseX + props.radius},${circleTopPoint + props.radius * 2}
          l0,${props.height / 2 - props.radius}
          l${boxWidth},0
          l0,${-props.height}
          l${-boxWidth},0
          l0,${props.height}`}
        data-nodeid={props.id}
        pointerEvents="painted"
        fillOpacity="0"
        onClick={props.events.click}
        onMouseOver={props.events.select}
        onMouseLeave={props.events.clearSelect}
        stroke={props.strokeColor}
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
      />
    </g>
  )
}
