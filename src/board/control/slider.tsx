import React from "react"
import { ControlsTheme } from "./base"
import styled from "styled-components"

interface SliderControlProps {
  title: string
  max: number
  min: number
  onChange: any
  value: number
}

interface SliderProps extends SliderControlProps {
  theme: ControlsTheme
}

export const SliderControl = (props: SliderControlProps) => {
  return (
    <SliderPanel>
      <p>{props.title}</p>
      <Slider {...props}></Slider>
    </SliderPanel>
  )
}

const SliderPanel = styled.div.attrs(props => props)`
  display: block;
`

export const Slider = styled.input.attrs((props: SliderProps) => {
  return {
    max: props.max,
    min: props.min,
    onChange: props.onChange,
    type: "range",
    value: props.value
  }
})`
  -webkit-appearance: none;
  -webkit-transition: 0.2s;
  appearance: none;
  background: ${props => props.theme.bg};
  height: 10px;
  opacity: 0.7;
  outline: none;
  transition: opacity 0.2s;
  width: 90%;

  &:hover {
    opacity: 0.8;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: ${props => props.theme.fg};
    cursor: pointer;
    height: 15px;
    width: 25px;
  }

  &::-moz-range-thumb {
    background: ${props => props.theme.fg};
    cursor: pointer;
    height: 15px;
    width: 25px;
  }
`
