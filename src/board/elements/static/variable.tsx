import React from "react"
import styled from "styled-components"
import {
  useTheme,
  VarName,
  useSelected,
  useCoords,
  useColor,
  useControl,
  useEvents
} from "../../state"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  variableName: VarName
}

export const Var = (props: VarProps) => {
  const color = useColor(props.id)
  const radius = useControl().circleRadius
  const coord = useCoords()[props.id]
  const isSelected = useSelected(selected => props.id === selected)

  return (
    <RawVar
      events={useEvents()}
      id={props.id}
      color={color}
      stroke={useTheme().selectedStroke}
      strokeOpacity={isSelected ? "1" : "0"}
      radius={radius}
      x={coord.x}
      y={coord.y}
    />
  )
}

interface RawVarProps extends RawExprProps {
  radius: number
  color: string
  stroke: string
  strokeOpacity: string
}

const RawVar = styled.ellipse.attrs((props: RawVarProps) => ({
  id: props.id,
  "data-nodeid": props.id,
  ...props.events,
  cx: props.x + props.radius,
  cy: props.y,
  rx: props.radius
}))`
  fill: ${props => props.color};

  &:hover {
    stroke-opacity: ${(props: RawVarProps) => props.strokeOpacity}
    stroke-width: 4;
    stroke: ${(props: RawVarProps) => props.stroke};
  }
`
