import _ from "lodash"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
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

const mapState = (state: BoardState) => ({ state })
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

export type BoardProps = ReturnType<typeof mapState> & typeof mapDispatch & { className?: string }

export const BoardContent = connect(
  mapState,
  mapDispatch
)(styled((props: BoardProps) => {
  const [dragging, setDragging] = useState(false)
  const [origin, setOrigin] = useState({ x: useLayout().startX, y: useLayout().startY })
  const [coord, setCoord] = useState({ x: 0, y: 0 })
  useEffect(() => testEffects(props))
  return (
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
      className={props.className}
    >
      {drawExprs(props.state, useCoords())}
    </svg>
  )
})`
  background: ${(props: BoardProps) => props.state.visual.theme.background};
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
`)

const drawExprs = (props: BoardState, coords: Coords) =>
  _.sortBy(
    _.omitBy(
      _.map(props.tree.nodes, (node, nodeID) => {
        if (coords[nodeID])
          switch (node.type) {
            case "VARIABLE":
              return <Var key={nodeID} id={nodeID} variableName={node.name} />
            case "ABSTRACTION":
              return <Abs key={nodeID} id={nodeID} variableName={node.variableName} />
            case "APPLICATION":
              return <Appl key={nodeID} id={nodeID} />
            default:
          }
      }),
      _.isNil
    ),
    expr => coords[expr.props.id].x
  )

const testEffects = (props: BoardProps) => {
  if (!props.state.tree.root) {
    props.addApp("app2", "app1", "abs2")
    props.addApp("app1", "abs1", "var1")
    props.addAbs("abs1", "a", "var2")
    props.addVar("var2", 0, "b")
    props.addVar("var1", -1, "a")
    props.addAbs("abs2", "n", "abs3")
    props.addAbs("abs3", "e", "app3")
    props.addApp("app3", "var3", "var4")
    props.addVar("var3", 1, "c")
    props.addVar("var4", 0, "d")

    props.setRoot("app2")
    props.setEvent("click", e => {
      console.log(e.currentTarget.getAttribute("data-nodeid"))
      props.setEvent("select", undefined)
      props.setEvent("clearSelect", undefined)
      props.setSelected(e.currentTarget.getAttribute("data-nodeid") || undefined)
    })
    props.setEvent("select", e => {
      props.setSelected(e.currentTarget.getAttribute("data-nodeid") || undefined)
    })
    props.setEvent("highlight", e =>
      props.setHighlighted(e.currentTarget.getAttribute("data-nodeid") || undefined)
    )
  }
}
