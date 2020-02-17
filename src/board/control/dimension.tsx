import { useDimensions, useDispatch, setDimension } from "board/state"
import { Slider } from "components"
import React from "react"

const DimensionControl = () => {
  const dimensions = useDimensions()
  const dis = useDispatch()
  return (
    <div>
      <Slider
        title="Circle Radius"
        onChange={(newValue: number) => dis(setDimension("circleRadius", newValue))}
        min={15}
        max={50}
        value={dimensions.circleRadius}
      />
      <Slider
        title="Width Margin"
        onChange={(newValue: number) => dis(setDimension("widthMargin", newValue))}
        min={25}
        max={75}
        value={dimensions.widthMargin}
      />
      <Slider
        title="Height Margin"
        onChange={(newValue: number) => dis(setDimension("heightMargin", newValue))}
        min={15}
        max={65}
        value={dimensions.heightMargin}
      ></Slider>
    </div>
  )
}

export default DimensionControl
