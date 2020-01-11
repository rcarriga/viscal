import React from "react"
import styled from "styled-components"
import { Theme, useTheme } from "../state"

interface SliderControlProps {
  title: string
  max: number
  min: number
  onChange: any
  value: number
}

export const SliderControl = (props: SliderControlProps) => {
  const theme = useTheme()
  return (
    <SliderPanel>
      <SliderTitle>{props.title}</SliderTitle>
      <Slider {...props} visTheme={theme}></Slider>
    </SliderPanel>
  )
}

interface SliderTitleProps {
  text: string
  fontSize: number
}

const SliderTitle = styled.p.attrs(props => props)`
  font-size: 10pt;
`

interface SliderProps extends SliderControlProps {
  visTheme: Theme
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
  background: ${(props: SliderProps) => props.visTheme.secondary};
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
    background: ${(props: SliderProps) => props.visTheme.primary};
    cursor: pointer;
    height: 15px;
    width: 25px;
  }

  &::-moz-range-thumb {
    background: ${(props: SliderProps) => props.visTheme.primary};
    cursor: pointer;
    height: 15px;
    width: 25px;
  }
`