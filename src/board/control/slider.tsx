import { Slider, Typography } from "@material-ui/core"
import React from "react"
import styled from "styled-components"

interface SliderControlProps {
  title: string
  max: number
  min: number
  onChange: any
  value: number
}

export const SliderControl = (props: SliderControlProps) => {
  return (
    <SliderPanel>
      <SliderTitle>{props.title}</SliderTitle>
      <SliderX
        onChange={props.onChange}
        value={props.value}
        max={props.max}
        min={props.min}
      ></SliderX>
    </SliderPanel>
  )
}

interface SliderTitleProps {
  text: string
  fontSize: number
}

const SliderTitle = styled(Typography)``

const SliderPanel = styled.div.attrs(props => props)`
  display: block;
  justify-content: center;
  text-align: center;
`

const SliderX = styled(Slider)`
  width: 80%;
`
