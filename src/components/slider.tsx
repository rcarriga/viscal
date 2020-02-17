import { Slider as _Slider } from "@material-ui/core"

import React from "react"

interface SliderControlProps {
  title: string
  max: number
  min: number
  onChange: (newValue: number) => void
  value: number
}

const Slider = (props: SliderControlProps) => {
  return (
    <SliderPanel>
      <SliderTitle>{props.title}</SliderTitle>
      <_Slider
        onChange={(_: any, value) => props.onChange(typeof value === "number" ? value : value[0])}
        value={props.value}
        max={props.max}
        min={props.min}
      ></_Slider>
    </SliderPanel>
  )
}

export default Slider

interface SliderTitleProps {
  children: React.ReactNode[] | React.ReactNode
}

const SliderTitle = (props: SliderTitleProps) => <div className="has-text-dark is-4">{props.children}</div>

const SliderPanel = (props: any) => <div className="container">{props.children}</div>
