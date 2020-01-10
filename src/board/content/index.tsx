import _ from "lodash"
import React, { useEffect, useState } from "react"
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
  setEvent,
  setLayout,
  useLayout,
  useCoords,
  Coords
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
  setSelected,
  setLayout
}

export type BoardProps = ReturnType<typeof mapState> & typeof mapDispatch

export const BoardContent = connect(
  mapState,
  mapDispatch
)((props: BoardProps) => {
  const [dragging, setDragging] = useState(false)
  const [origin, setOrigin] = useState({ x: useLayout().startX, y: useLayout().startY })
  const [coord, setCoord] = useState({ x: 0, y: 0 })
  useEffect(() => testEffects(props))
  return (
    <div>
      <svg
        pointerEvents="all"
        onMouseDown={e => {
          setCoord({ x: e.clientX - origin.x, y: e.clientY - origin.y })
          setDragging(true)
        }}
        onMouseUp={e => {
          setDragging(false)
          setOrigin({ x: e.clientX - coord.x, y: e.clientY - coord.y })
        }}
        onMouseMove={e => {
          if (dragging) {
            props.setLayout("startX", e.clientX - coord.x)
            props.setLayout("startY", e.clientY - coord.y)
          }
        }}
        className="viewport"
      >
        {drawExprs(props.state, useCoords())}
      </svg>
    </div>
  )
})

const testEffects = (props: BoardProps) => {
  if (!props.state.tree.root) {
    props.addVar("var1", -1, "a", "abs1")
    props.addApp("app1", "abs1", "var1")
    props.addAbs("abs1", "a", "var2", "app1")
    props.addVar("var2", 0, "a", "abs1")
    props.addVar("var3", 0, "n", "abs2")
    props.addAbs("abs2", "n", "var3", "app2")
    props.addApp("app2", "app1", "abs2")
    props.setRoot("app2")
    props.setEvent("click", console.log)
    props.setEvent("select", e => {
      props.setSelected(e.currentTarget.getAttribute("data-nodeid") || undefined)
    })
    props.setEvent("highlight", e =>
      props.setHighlighted(e.currentTarget.getAttribute("data-nodeid") || undefined)
    )
    props.setEvent("clearhighlight", () => props.setHighlighted())
    props.setEvent("clearSelect", () => props.setSelected())
  }
}

const drawExprs = (props: BoardState, coords: Coords) => {
  const exprs = _.map(_.keys(props.tree.nodes), nodeID => drawExpr(nodeID, props) || <div></div>)
  const nodes = _.sortBy(exprs, expr => coords[expr.props.id].x)
  return nodes
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
