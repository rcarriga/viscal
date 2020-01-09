import _ from "lodash"
import React, { useEffect } from "react"
import { BoardProps } from "./base"
import { Var, Abs, Appl } from "./elements"
import { BoardState, VARIABLE, ABSTRACTION, APPLICATION } from "./state"

export const BoardContent = (props: BoardProps) => {
  useEffect(() => {
    if (!props.state.tree.root) {
      props.addApp("app1", "abs1", "var1")
      props.addAbs("abs1", "a", "var2", "app1")
      props.addVar("var1", -1, "a", "abs1")
      props.addVar("var2", 0, "a", "abs1")
      props.setRoot("app1")
      props.setOnClick(console.log)
      props.setOnMouseOver(e =>
        props.setSelected(e.currentTarget.getAttribute("data-nodeid") || undefined)
      )
    }
  })
  return (
    <div>
      <svg className="viewport">{drawExprs(props.state)}</svg>
    </div>
  )
}

const drawExprs = (props: BoardState) => {
  const exprs = _.map(_.keys(props.tree.nodes), nodeID => drawExpr(nodeID, props))
  return _.sortBy(exprs, expr => (expr ? expr.props.w : 0))
}
const drawExpr = (nodeID: string, board: BoardState) => {
  const node = board.tree.nodes[nodeID]
  switch (node.type) {
    case VARIABLE:
      return <Var key={nodeID} id={nodeID} variableName={node.name} />
    case ABSTRACTION:
      return <Abs key={nodeID} id={nodeID} variableName={node.variableName} />
    case APPLICATION:
      return <Appl key={nodeID} id={nodeID} />
    default:
  }
}
