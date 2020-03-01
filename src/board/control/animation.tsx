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
        onChange={(newValue: number) => dis(setAnimationSetting("tension", newValue))}
        min={50}
        max={500}
        value={settings.tension || 100}
      />
    </div>
  )
}

export default AnimationControl
