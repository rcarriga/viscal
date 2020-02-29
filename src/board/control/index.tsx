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
    <div className="card" style={{ minWidth: 220 }}>
      <div className="card-content">
        <div className="menu">{props.children}</div>
      </div>
    </div>
  )
}
