import React from "react"
import styled from "styled-components"
import {
  useTheme,
  VarName,
  useDimensions,
  useHighligthed,
  useSelected,
  useCoords,
  useColor,
  useEvents,
  VarIndex
} from "../../state"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  index: VarIndex
  variableName: VarName
}

export const Var = (props: VarProps) => {
  const color = useColor(props.id)
  const radius = useDimensions().circleRadius
  const coord = useCoords()[props.id]
  const isSelected = props.id === useSelected()
  const isHighlighted = useHighligthed(props.id, props.index)
  const theme = useTheme()
  const stroke = isHighlighted ? theme.highlightedStroke : theme.selectedStroke
  const strokeOpacity = Number(isHighlighted || isSelected)
  const strokeWidth = useDimensions().strokeWidth

  return (
    <RawVar
      events={useEvents()}
      id={props.id}
      color={color}
      stroke={stroke}
      strokeOpacity={strokeOpacity}
      strokeWidth={strokeWidth}
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
  strokeOpacity: number
  strokeWidth: number
}

const RawVar = styled.ellipse.attrs((props: RawVarProps) => ({
  id: props.id,
  "data-nodeid": props.id,
  onClick: props.events.click,
  onMouseOver: props.events.select,
  cx: props.x + props.radius,
  cy: props.y,
  rx: props.radius
}))`
  fill: ${props => props.color};
  stroke-opacity: ${(props: RawVarProps) => props.strokeOpacity}
  stroke-width: ${(props: RawVarProps) => props.strokeWidth};
  stroke: ${(props: RawVarProps) => props.stroke};
`
