import React from "react"
import styled from "styled-components"
import { VarName, useSelected, useCoords, useColor, useControl } from "../../state"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  variableName: VarName
}

export const Var = (props: VarProps) => {
  const color = useColor(props.id)
  const radius = useControl().circleRadius
  const coord = useCoords()[props.id]
  const isSelected = useSelected(selected => props.id === selected)
  const selectedColor = "grey"

  return (
    <RawVar
      id={props.id}
      color={color}
      isSelected={isSelected}
      radius={radius}
      selectedColor={selectedColor}
      x={coord.x}
      y={coord.y}
    />
  )
}

interface RawVarProps extends RawExprProps {
  radius: number
  color: string
  selectedColor: string
  isSelected: boolean
}

const RawVar = styled.ellipse.attrs((props: RawVarProps) => ({
  id: props.id,
  onClick: console.log,
  cx: props.x + props.radius,
  cy: props.y,
  rx: props.radius
}))`
  fill: ${props => props.color};

  &:hover {
    stroke-opacity: ${(props: RawVarProps) => (props.isSelected ? 1 : 0)}
    stroke: ${(props: RawVarProps) => props.selectedColor};
  }
`
