import React, { useEffect } from "react"
import _ from "lodash"
import { BoardProps } from "./base"
import { BoardState, VARIABLE, ABSTRACTION, APPLICATION, coordsSelector, Coord } from "./state"
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
  const coords = coordsSelector(props)
  const exprs = _.map(coords, (coord, nodeID) => drawExpr(nodeID, coord, props))
  return _.sortBy(exprs, expr => (expr ? -expr.props.w : 0))
}

const drawExpr = (nodeID: string, coord: Coord, board: BoardState) => {
  switch (board.tree.nodes[nodeID].expr.type) {
    case VARIABLE:
      return (
        <Var
          color="pink"
          key={nodeID}
          id={nodeID}
          x={coord.x}
          y={coord.y}
          radius={board.control.circleRadius}
        />
      )
    case ABSTRACTION:
      return (
        <Abs
          key={nodeID}
          id={nodeID}
          x={coord.x}
          y={coord.y}
          width={coord.w}
          radius={board.control.circleRadius}
          height={coord.h}
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
          x={coord.x}
          y={coord.y}
          radius={board.control.circleRadius}
          width={coord.w}
          height={coord.h}
          heightMargin={board.control.heightMargin}
          widthMargin={board.control.widthMargin}
          strokeWidth={board.control.strokeWidth}
        />
      )
    default:
  }
}
