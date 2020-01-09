import _ from "lodash"
import React, { useEffect } from "react"
import { connect } from "react-redux"
import { AppState } from "../../state"
import {
  BoardState,
  addVariable,
  addAbstraction,
  addApplication,
  setRoot,
  setSelected,
  setHighlighted,
  setEvent
} from "../state"
import { Var, Abs, Appl } from "./elements"

const mapState = (state: AppState) => ({ state: state.board })
const mapDispatch = {
  addAbs: addAbstraction,
  addApp: addApplication,
  addVar: addVariable,
  setRoot,
  setEvent,
  setHighlighted,
  setSelected
}

export type BoardProps = ReturnType<typeof mapState> & typeof mapDispatch

export const BoardContent = connect(
  mapState,
  mapDispatch
)((props: BoardProps) => {
  useEffect(() => {
    if (!props.state.tree.root) {
      props.addApp("app1", "abs1", "var1")
      props.addAbs("abs1", "a", "var2", "app1")
      props.addVar("var1", -1, "a", "abs1")
      props.addVar("var2", 0, "a", "abs1")
      props.setRoot("app1")
      props.setEvent("click", console.log)
      props.setEvent("select", e =>
        props.setSelected(e.currentTarget.getAttribute("data-nodeid") || undefined)
      )
      props.setEvent("highlight", e =>
        props.setHighlighted(e.currentTarget.getAttribute("data-nodeid") || undefined)
      )
      props.setEvent("clearhighlight", () => props.setHighlighted())
      props.setEvent("clearSelect", () => props.setSelected())
    }
  })
  return (
    <div>
      <svg className="viewport">{drawExprs(props.state)}</svg>
    </div>
  )
})

const drawExprs = (props: BoardState) => {
  const exprs = _.map(_.keys(props.tree.nodes), nodeID => drawExpr(nodeID, props))
  return _.sortBy(exprs, expr => (expr ? expr.props.w : 0))
}

const drawExpr = (nodeID: string, board: BoardState) => {
  const node = board.tree.nodes[nodeID]
  switch (node.type) {
    case "VARIABLE":
      return <Var key={nodeID} id={nodeID} index={node.index} variableName={node.name} />
    case "ABSTRACTION":
      return <Abs key={nodeID} id={nodeID} variableName={node.variableName} />
    case "APPLICATION":
      return <Appl key={nodeID} id={nodeID} />
    default:
  }
}
