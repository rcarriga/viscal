import React from "react"
import {
  VarName,
  useColor,
  useCoords,
  useDimensions,
  useEvents,
  useHighligthed,
  useSelected,
  useTheme,
  useLayout
} from "../../../state"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  variableName: VarName
}

export const Var = (props: VarProps) => {
  const coord = useCoords()[props.id]
  const isHighlighted = useHighligthed(props.id)
  const theme = useTheme()

  return (
    <RawVar
      color={useColor(props.id)}
      events={useEvents()}
      id={props.id}
      radius={useDimensions().circleRadius}
      strokeColor={isHighlighted ? theme.highlightedStroke : theme.selectedStroke}
      strokeOpacity={Number(props.id === useSelected() || isHighlighted)}
      strokeWidth={useDimensions().strokeWidth}
      x={coord.x}
      y={coord.y}
    />
  )
}

interface RawVarProps extends RawExprProps {
  color: string
  radius: number
  strokeColor: string
  strokeOpacity: number
  strokeWidth: number
}

const RawVar = (props: RawVarProps) => {
  const { startX, startY } = useLayout()
  return (
    <path
      d={`M${startX + props.x},${startY + props.y} a${props.radius},${
        props.radius
      } 0 1,0 ${props.radius * 2},0
    a${props.radius},${props.radius} 0 1,0 -${props.radius * 2},0`}
      data-nodeid={props.id}
      id={props.id}
      onClick={props.events.click}
      onMouseOver={props.events.highlight}
      rx={props.radius}
      fill={props.color}
      strokeOpacity={props.strokeOpacity}
      strokeWidth={props.strokeWidth}
      stroke={props.strokeColor}
    />
  )
}
