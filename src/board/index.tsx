/* eslint-disable react/no-children-prop */
import React from "react"
import _ from "lodash"
import { BoardState, VARIABLE, ABSTRACTION, APPLICATION } from "./state"
import { AppState } from "../state"
import { Var, Abs, Appl } from "./elements"
import { connect } from "react-redux"

const mapStateToProps = (state: AppState) => state.board

export const Board = connect(mapStateToProps)((state: BoardState) => {
  return (
    <svg className="viewport">
      {_.map(_.keys(state.coords), nodeID => createExpr(nodeID, state))}
    </svg>
  )
})

const createExpr = (nodeID: string, board: BoardState) => {
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
  }
}
