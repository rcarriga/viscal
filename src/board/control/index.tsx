import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import AnimationControl from "board/control/animation"
import React, { useState } from "react"
import { animated, useTransition, useSpring } from "react-spring"

import ExpressionControl from "./expression"
import ReducerControl from "./reducer"
import ScaleControl from "./scale"

const ControlPanel = (props: any) => {
  const [show, setShow] = useState(true)
  const arrow = useSpring({
    display: "inline-block",
    transform: show ? "rotate(180deg)" : "rotate(720deg)"
  })
  const children = useSpring({
    display: "block",
    padding: 5,
    maxHeight: show ? 300 : 0,
    opacity: show ? 1 : 0,
    overflow: show ? "visible" : "hidden",
    clear: "both"
  })

  return (
    <div className="box" style={{ width: 250 }}>
      <div
        style={{
          cursor: "pointer"
        }}
        onClick={() => setShow(!show)}
      >
        <div className="subtitle" style={{ float: "left" }}>
          Controls
        </div>
        <div style={{ float: "right" }}>
          <animated.div style={arrow}>
            <ArrowDropDownIcon />
          </animated.div>
        </div>
      </div>
      <animated.div className="menu" style={children}>
        <ExpressionControl />
        <ScaleControl />
        <AnimationControl />
      </animated.div>
      <ReducerControl />
    </div>
  )
}

export default ControlPanel
