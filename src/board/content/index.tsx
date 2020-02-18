import {
  addVariable,
  addAbstraction,
  addApplication,
  setRoot,
  setSelected,
  setHighlighted,
  setEvent,
  nextReductionStage,
  NodeID,
  useTreeState,
  useDispatch
} from "board/state"
import React, { useEffect } from "react"
import { animated } from "react-spring"
import { style, classes } from "typestyle"
import TreeGraph from "./elements"

const BoardContent = () => {
  const treeState = useTreeState()
  const dis = useDispatch()
  usePopTree(dis, treeState.root)
  return (
    <animated.svg
      id="board-content"
      pointerEvents="all"
      className={classes(
        "has-background-light",
        style({
          width: "100%",
          height: "100%"
        })
      )}
      onClick={() => {
        if (treeState.reduction) dis(nextReductionStage())
      }}
    >
      <TreeGraph />
    </animated.svg>
  )
}

export default BoardContent

const usePopTree = (dis: any, root?: NodeID) => {
  useEffect(() => {
    if (!root) {
      dis(addApplication("app2", "app1", "var1"))
      dis(addApplication("app1", "abs1", "abs2"))
      dis(addAbstraction("abs1", "a", "var2"))
      dis(addVariable("var2", 0, "b"))
      dis(addAbstraction("abs2", "n", "abs3"))
      dis(addAbstraction("abs3", "e", "app3"))
      dis(addApplication("app3", "var3", "var4"))
      dis(addVariable("var3", 1, "c"))
      dis(addVariable("var4", 0, "d"))
      dis(addVariable("var1", undefined, "a"))

      dis(setRoot("app2"))
      dis(
        setEvent("click", nodeID => {
          dis(setEvent("select", undefined))
          dis(setEvent("clearSelect", undefined))
          dis(setSelected(nodeID))
        })
      )
      dis(
        setEvent("select", nodeID => {
          dis(setSelected(nodeID))
        })
      )
      dis(setEvent("highlight", nodeID => dis(setHighlighted(nodeID))))
      dis(
        setEvent("clearHighlight", () => {
          dis(setHighlighted(undefined))
        })
      )
    }
  })
}
