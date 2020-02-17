import React from "react"

import { connectState, ControlProps } from "./base"
import { ExpressionControl } from "./expression"
import { SliderControl } from "./slider"

export const BoardControl = connectState((props: ControlProps) => {
  return (
    <ControlPanel>
      <ExpressionControl value="" onChange={console.log} placeHolder="Write a lambda expression here." />
      <hr className="dropdown-divider" />
      <SliderControl
        title="Circle Radius"
        onChange={(newValue: number) => props.setDimension("circleRadius", newValue)}
        min={15}
        max={50}
        value={props.state.dimensions.circleRadius}
      ></SliderControl>
      <SliderControl
        title="Width Margin"
        onChange={(newValue: number) => props.setDimension("widthMargin", newValue)}
        min={25}
        max={75}
        value={props.state.dimensions.widthMargin}
      ></SliderControl>
      <SliderControl
        title="Height Margin"
        onChange={(newValue: number) => props.setDimension("heightMargin", newValue)}
        min={15}
        max={65}
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
