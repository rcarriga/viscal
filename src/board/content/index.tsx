import React, { useEffect } from "react"
import { connect } from "react-redux"
import { animated } from "react-spring"
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
  setMoving,
  setStopped,
  queueReduction,
  nextReductionStage,
  adjustLayout,
  NodeID
} from "../state"
import { createReduction } from "./calculus"
import { TreeGraph } from "./elements"

const mapState = (state: BoardState) => ({ state })
const mapDispatch = {
  addAbs: addAbstraction,
  addApp: addApplication,
  addVar: addVariable,
  setRoot,
  setEvent,
  setHighlighted,
  setSelected,
  setLayout,
  setMoving,
  setStopped,
  adjustLayout,
  queueReduction,
  nextReductionStage
}

export type BoardProps = ReturnType<typeof mapState> & typeof mapDispatch & { className?: string }

export const BoardContent = connect(
  mapState,
  mapDispatch
)(styled((props: BoardProps) => {
  useEffect(() => {
    if (!props.state.tree.root) {
      props.addApp("app2", "app1", "var1")
      props.addApp("app1", "abs1", "abs2")
      props.addAbs("abs1", "a", "var2")
      props.addVar("var2", 0, "b")
      props.addAbs("abs2", "n", "abs3")
      props.addAbs("abs3", "e", "app3")
      props.addApp("app3", "var3", "var4")
      props.addVar("var3", 1, "c")
      props.addVar("var4", 0, "d")
      props.addVar("var1", undefined, "a")

      props.setRoot("app2")
      props.setEvent("click", nodeID => {
        props.setEvent("select", undefined)
        props.setEvent("clearSelect", undefined)
        props.setSelected(nodeID)
      })
      props.setEvent("select", nodeID => {
        props.setSelected(nodeID)
      })
      props.setEvent("highlight", nodeID => props.setHighlighted(nodeID))
      props.setEvent("clearHighlight", () => {
        props.setHighlighted(undefined)
      })
      props.setEvent("move", (nodeID: NodeID) => {
        props.setMoving(nodeID)
      })
      props.setEvent("rest", (nodeID: NodeID) => {
        props.setStopped(nodeID)
      })
    }
  })
  return (
    <animated.svg
      id="board-content"
      pointerEvents="all"
      onClick={() => {
        if (props.state.tree.reduction) props.nextReductionStage()
        else props.queueReduction(createReduction("app2", props.state.tree))
      }}
      className={props.className}
    >
      <TreeGraph layout={props.state.visual.treeLayout} tree={props.state.tree.nodes} />
    </animated.svg>
  )
})`
  background: ${(props: BoardProps) => props.state.visual.theme.background};
  height: 100%;
  width: 100%;
  flex-grow: 3;
  padding: 0px;
`)
