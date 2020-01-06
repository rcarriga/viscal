import React from "react"
import styled, { ThemeProvider } from "styled-components"

import { SliderControl } from "./slider"
import { ExpressionControl } from "./expression"
import { connectState, ControlProps } from "./base"

export const BoardControl = connectState((props: ControlProps) => {
  const theme = {
    bg: "#262626",
    border: "#49483E",
    fg: "#a9ff68"
  }
  return (
    <ThemeProvider theme={theme}>
      <ControlPanel>
        <ExpressionControl
          value=""
          onChange={console.log}
          placeHolder="Write a lambda expression here."
        />
        <SliderControl
          title="Circle Radius"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.setRadius(Number(e.currentTarget.value))
          }
          min={15}
          max={50}
          value={props.state.circleRadius}
        ></SliderControl>
        <SliderControl
          title="Margins"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.setWidthMargin(Number(e.currentTarget.value))
          }
          min={15}
          max={50}
          value={props.state.widthMargin}
        ></SliderControl>
      </ControlPanel>
    </ThemeProvider>
  )
})

const ControlPanel = styled.div.attrs(props => props)`
  display: inline-block;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 30vw;
  margin: 1vw;
  padding: 1vw;
  border: 5px groove ${props => props.theme.border};
`
