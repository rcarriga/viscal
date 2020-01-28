import { Drawer } from "@material-ui/core"
import { StylesProvider } from "@material-ui/core/styles"
import React from "react"
import styled from "styled-components"

import { connectState, ControlProps } from "./base"
import { ExpressionControl } from "./expression"
import { SliderControl } from "./slider"

export const BoardControl = connectState((props: ControlProps) => {
  return (
    <StylesProvider injectFirst>
      <ControlPanel variant="permanent">
        <ExpressionControl value="" onChange={console.log} placeHolder="Write a lambda expression here." />
        <SliderControl
          title="Circle Radius"
          onChange={(e: React.ChangeEvent<HTMLInputElement>, newValue: number) =>
            props.setDimension("circleRadius", newValue)
          }
          min={15}
          max={50}
          value={props.state.dimensions.circleRadius}
        ></SliderControl>
        <SliderControl
          title="Margins"
          onChange={(e: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
            props.setDimension("widthMargin", newValue)
          }}
          min={15}
          max={50}
          value={props.state.dimensions.widthMargin}
        ></SliderControl>
      </ControlPanel>
    </StylesProvider>
  )
})

const ControlPanel = styled(Drawer)`
  padding: 20px;
  justify-content: center;
  display: flex;
  flex-shrink: 0;
`
