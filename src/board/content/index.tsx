import { setSelected, setHighlighted, setEvent, nextReductionStage, useTreeState, useDispatch } from "board/state"
import React, { useEffect, useState } from "react"
import { animated } from "react-spring"
import Graph from "./elements"
import Tooltip from "./tooltip"

const BoardContent = () => {
  const treeState = useTreeState()
  const dis = useDispatch()
  usePopTree(dis)
  return (
    <animated.svg
      id="board-content"
      pointerEvents="all"
      className="has-background-light"
      style={{
        width: "100%",
        height: "100%"
      }}
      onClick={() => {
        if (treeState.reduction) dis(nextReductionStage())
      }}
    >
      <Tooltip />
      <Graph />
    </animated.svg>
  )
}

export default BoardContent

const usePopTree = (dis: any) => {
  const [used, setUsed] = useState(false)
  useEffect(() => {
    if (!used) {
      setUsed(true)
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
  }, [used, dis])
}
