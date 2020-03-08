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
        onChange={(value: number) => dis(setAnimationSetting({ setting: "tension", value }))}
        min={50}
        max={500}
        value={settings.tension || 100}
      />
    </div>
  )
}

export default AnimationControl
