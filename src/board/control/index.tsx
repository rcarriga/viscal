import React from "react"
import styled from "styled-components"

import { Theme, useTheme } from "../state"
import { connectState, ControlProps } from "./base"
import { ExpressionControl } from "./expression"
import { SliderControl } from "./slider"

export const BoardControl = connectState((props: ControlProps) => {
  const theme = useTheme()
  return (
    <ControlPanel visTheme={theme}>
      <ExpressionControl
        value=""
        onChange={console.log}
        placeHolder="Write a lambda expression here."
      />
      <SliderControl
        title="Circle Radius"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.setDimension("circleRadius", Number(e.currentTarget.value))
        }
        min={15}
        max={50}
        value={props.state.dimensions.circleRadius}
      ></SliderControl>
      <SliderControl
        title="Margins"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          props.setDimension("widthMargin", Number(e.currentTarget.value))
        }}
        min={15}
        max={50}
        value={props.state.dimensions.widthMargin}
      ></SliderControl>
    </ControlPanel>
  )
})

interface ControlPanelProps {
  visTheme: Theme
}

const ControlPanel = styled.div.attrs((props: ControlPanelProps) => props)`
  background: ${(props: ControlPanelProps) => props.visTheme.background};
  display: inline-block;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 30vw;
  margin: 1vw;
  padding: 1vw;
  border: 5px groove ${props => props.theme.border};
`
