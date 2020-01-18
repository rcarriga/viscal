import { motion } from "framer-motion"
import React, { useEffect } from "react"
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
  useCoord,
  queueReduction,
  nextReductionStage
} from "../state"
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
      props.setEvent("clearHighlight", e => {
        props.setHighlighted(undefined)
      })
    }
  })
  return (
    <div>
      <motion.svg
        id="board-content"
        pointerEvents="all"
        drag
        onDrag={(e, info) => {
          props.setLayout("startX", props.state.visual.treeLayout.startX + info.delta.x)
          props.setLayout("startY", props.state.visual.treeLayout.startY + info.delta.y)
        }}
        className={props.className}
      >
        <TreeGraph board={props.state} />
      </motion.svg>
    </div>
  )
})`
  background: ${(props: BoardProps) => props.state.visual.theme.background};
  height: 100%;
  width: 100%;
  margin: 5px;
  flex-grow: 3;
  padding: 0px;
`)
