import { useDimensions, useDispatch, updateDimensions } from "board/state"
import { Slider } from "components"
import _ from "lodash"
import React, { useState } from "react"

const ScaleControl = () => {
  const dimensions = useDimensions()
  const dis = useDispatch()
  const [scaleBy, setScale] = useState(10)
  return (
    <div>
      <div className="menu-label">Scale</div>
      <Slider
        onChange={newVal => {
          dis(
            updateDimensions(
              _.mapValues(dimensions, (val, key) =>
                key !== "strokeWidth" ? Math.round((val * newVal) / scaleBy) : val
              )
            )
          )
          setScale(newVal)
        }}
        min={1}
        max={20}
        value={scaleBy}
      ></Slider>
    </div>
  )
}

export default ScaleControl
