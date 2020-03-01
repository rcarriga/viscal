import AnimationControl from "board/control/animation"
import React from "react"

import ExpressionControl from "./expression"
import ReducerControl from "./reducer"
import ScaleControl from "./scale"

const BoardControl = () => {
  return (
    <ControlPanel>
      <ExpressionControl />
      <hr className="dropdown-divider" />
      <ScaleControl />
      <hr className="dropdown-divider" />
      <AnimationControl />
      <hr className="dropdown-divider" />
      <ReducerControl />
      <hr className="dropdown-divider" />
    </ControlPanel>
  )
}

export default BoardControl

const ControlPanel = (props: any) => {
  return (
    <div className="card" style={{ minWidth: 220 }}>
      <div className="card-content">
        <div className="menu">{props.children}</div>
      </div>
    </div>
  )
}
