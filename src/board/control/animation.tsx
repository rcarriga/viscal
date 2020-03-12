import { useAnimationSettings, useDispatch, setAnimationSetting } from "board/state"
import { Slider } from "components"
import React from "react"

const AnimationControl = () => {
  const settings = useAnimationSettings()
  const dis = useDispatch()
  return (
    <div>
      <div className="menu-label">Speed</div>
      <Slider
        onChange={(value: number) => dis(setAnimationSetting({ setting: "duration", value: (100 - value) / 100 }))}
        min={1}
        max={100}
        value={100 - (settings.duration || 0.5) * 100}
      />
    </div>
  )
}

export default AnimationControl
