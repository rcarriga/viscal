import { adjustLayout, nextReductionStage, setAnimationEnabled, useTreeState, useDispatch } from "board/state"
import React from "react"
import { animated } from "react-spring"
import Graph from "./graph"
import Tooltip from "./tooltip"

const BoardContent = () => {
  const treeState = useTreeState()
  const dis = useDispatch()
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
      onWheel={e => {
        dis(setAnimationEnabled(false))
        if (e.deltaX) dis(adjustLayout({ parameter: "startX", value: e.deltaX * -10 }))
        else dis(adjustLayout({ parameter: "startX", value: e.deltaY * 10 }))
        dis(setAnimationEnabled(true))
      }}
    >
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
      <Graph />
      <Tooltip />
    </animated.svg>
  )
}

export default BoardContent
