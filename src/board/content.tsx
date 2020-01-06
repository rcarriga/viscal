/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react"
import _ from "lodash"
import { BoardProps } from "./base"
import { BoardState, VARIABLE, ABSTRACTION, APPLICATION } from "./state"
import { Var, Abs, Appl } from "./elements"

export const BoardContent = (props: BoardProps) => {
  useEffect(() => {
    if (!props.state.tree.root) {
      props.addVar("var1", 0, "a", "abs1")
      props.addVar("var2", 0, "a", "abs1")
      props.addAbs("abs1", "a", "var2", "app1")
      props.addApp("app1", "abs1", "var1")
      props.setRoot("app1")
    }
  })
  return (
    <div>
      <svg className="viewport">{drawExprs(props.state)}</svg>
    </div>
  )
}

const drawExprs = (props: BoardState) => {
  const exprs = _.map(_.keys(props.coords), nodeID => drawExpr(nodeID, props))
  return _.reverse(exprs ? _.sortBy(exprs, expr => (expr ? expr.props.w : 0)) : [])
}

const drawExpr = (nodeID: string, board: BoardState) => {
  const coords = board.coords[nodeID]
  switch (board.tree.nodes[nodeID].expr.type) {
    case VARIABLE:
      return (
        <Var
          key={nodeID}
          id={nodeID}
          x={coords.x}
          y={coords.y}
          radius={board.control.circleRadius}
        />
      )
    case ABSTRACTION:
      return (
        <Abs
          key={nodeID}
          id={nodeID}
          x={coords.x}
          y={coords.y}
          width={coords.w}
          radius={board.control.circleRadius}
          height={coords.h}
          heightMargin={board.control.heightMargin}
          widthMargin={board.control.widthMargin}
          strokeWidth={board.control.strokeWidth}
        />
      )
    case APPLICATION:
      return (
        <Appl
          key={nodeID}
          id={nodeID}
          x={coords.x}
          y={coords.y}
          radius={board.control.circleRadius}
          width={coords.w}
          height={coords.h}
          heightMargin={board.control.heightMargin}
          widthMargin={board.control.widthMargin}
          strokeWidth={board.control.strokeWidth}
        />
      )
    default:
  }
}
