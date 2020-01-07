import React from "react"
import { useSelected, useCoords, useColors, useControls } from "../../state"
import styled from "styled-components"
import { RawExprProps, ExprProps } from "./base"

interface VarProps extends ExprProps {
  variableName: string
}

export const Var = (props: VarProps) => {
  const color = useColors(colors => colors[props.id] || "black"),
    radius = useControls(controls => controls.circleRadius),
    coord = useCoords(coords => coords[props.id]),
    isSelected = useSelected(selected => props.id === selected),
    selectedColor = "grey"

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
