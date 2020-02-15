import React from "react"

import { connectState, ControlProps } from "./base"
import { ExpressionControl } from "./expression"
import { SliderControl } from "./slider"

export const BoardControl = connectState((props: ControlProps) => {
  return (
    <ControlPanel variant="permanent">
      <ExpressionControl value="" onChange={console.log} placeHolder="Write a lambda expression here." />
      <hr className="dropdown-divider" />
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
      <SliderControl
        title="Height Margin"
        onChange={(e: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
          props.setDimension("heightMargin", newValue)
        }}
        min={5}
        max={35}
        value={props.state.dimensions.heightMargin}
      ></SliderControl>
    </ControlPanel>
  )
})

const ControlPanel = (props: any) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="subtitle handle">Controls</div>
        {props.children}
      </div>
    </div>
  )
}
