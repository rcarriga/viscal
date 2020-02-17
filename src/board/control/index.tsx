import React from "react"

import DimensionControl from "./dimension"
import ExpressionControl from "./expression"
import ReducerControl from "./reducer"

const BoardControl = () => {
  return (
    <ControlPanel>
      <ExpressionControl />
      <hr className="dropdown-divider" />
      <DimensionControl />
      <hr className="dropdown-divider" />
      <ReducerControl />
    </ControlPanel>
  )
}

export default BoardControl

const ControlPanel = (props: any) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="subtitle handle">Controls</div>
        {props.children}
      </div>
    </div>
  )
}
