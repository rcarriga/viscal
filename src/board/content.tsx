/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import _ from "lodash"
import { BoardProps } from "./base"
import {
  addVariable,
  addAbstraction,
  addApplication,
  setRoot,
  BoardState,
  VARIABLE,
  ABSTRACTION,
  APPLICATION
} from "./state"
import { Var, Abs, Appl } from "./elements"

export const BoardContent = (props: BoardProps) => {
  return (
    <svg
      onClick={() => {
        props.addVar("var1", 0, "a", "abs1")
        props.addVar("var2", 0, "a", "abs1")
        props.addAbs("abs1", "a", "var2")
        props.addApp("app1", "abs1", "var1")
        props.setRoot("app1")
      }}
      className="viewport"
    >
      {_.map(_.keys(props.state.coords), nodeID => drawExpr(nodeID, props.state))}
    </svg>
  )
}

const drawExpr = (nodeID: string, board: BoardState) => {
  const coords = board.coords[nodeID]
  switch (board.tree.nodes[nodeID].expr.type) {
    case VARIABLE:
      return (
        <Var key={nodeID} id={nodeID} x={coords.x} y={coords.y} radius={board.draw.circleRadius} />
      )
    case ABSTRACTION:
      return (
        <Abs
          key={nodeID}
          id={nodeID}
          x={coords.x}
          y={coords.y}
          width={coords.w}
          radius={board.draw.circleRadius}
          height={coords.h}
          heightMargin={board.draw.heightMargin}
          widthMargin={board.draw.widthMargin}
          strokeWidth={board.draw.strokeWidth}
        />
      )
    case APPLICATION:
      return (
        <Appl
          key={nodeID}
          id={nodeID}
          x={coords.x}
          y={coords.y}
          radius={board.draw.circleRadius}
          width={coords.w}
          height={coords.h}
          heightMargin={board.draw.heightMargin}
          widthMargin={board.draw.widthMargin}
          strokeWidth={board.draw.strokeWidth}
        />
      )
    default:
  }
}
