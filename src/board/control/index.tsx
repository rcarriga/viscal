import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import MenuIcon from "@material-ui/icons/Menu"
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
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<MenuIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <div className="subtitle handle">Controls</div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className="container">{props.children}</div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
