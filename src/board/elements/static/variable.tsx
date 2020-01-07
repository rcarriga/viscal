import React from "react"
import { ExprProps } from "./base"
import styled from "styled-components"

interface VarProps extends ExprProps {
  color: string
}

export const Var = styled((props: VarProps) => {
  return (
    <ellipse
      id={props.id}
      className={props.className}
      cx={props.x + props.radius}
      cy={props.y}
      rx={props.radius}
    />
  )
})`
  fill: ${props => props.color};
`
