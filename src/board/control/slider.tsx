import { Slider } from "@material-ui/core"

import React from "react"

interface SliderControlProps {
  title: string
  max: number
  min: number
  onChange: (newValue: number) => void
  value: number
}

export const SliderControl = (props: SliderControlProps) => {
  return (
    <SliderPanel>
      <SliderTitle>{props.title}</SliderTitle>
      <Slider
        onChange={(_: any, value) => props.onChange(typeof value === "number" ? value : value[0])}
        value={props.value}
        max={props.max}
        min={props.min}
      ></Slider>
    </SliderPanel>
  )
}

interface SliderTitleProps {
  children: React.ReactNode[] | React.ReactNode
}

const SliderTitle = (props: SliderTitleProps) => <div className="has-text-dark is-4">{props.children}</div>

const SliderPanel = (props: any) => <div className="container">{props.children}</div>
