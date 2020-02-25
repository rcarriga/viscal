import { useCoords, useHighlighted, useSelected, useReduction, useDispatch, nextReductionStage } from "board/state"
import React, { useRef, Ref, useState } from "react"
import Abs from "./abstraction"
import Appl from "./application"
import Var from "./variable"

const Graph = () => {
  const coords = useCoords()
  const keys = useOrderedKeys()
  const { start, rest } = useMotionTrackers()
  return (
    <g>
      {keys.map(coordID => {
        switch (coords[coordID].type) {
          case "VARIABLE":
            return <Var key={coordID} id={coordID} rest={rest} start={start} />
          case "ABSTRACTION":
            return <Abs key={coordID} id={coordID} rest={rest} start={start} />
          case "APPLICATION":
            return <Appl key={coordID} id={coordID} rest={rest} start={start} />
          default:
            return null
        }
      })}
    </g>
  )
}

export default Graph

const useMotionTrackers = () => {
  const ref: Ref<Set<symbol>> = useRef(new Set([]))
  const dis = useDispatch()
  const [moving, setMoving] = useState(false)
  const start = (sym: symbol) => {
    if (ref.current) {
      ref.current.add(sym)
      if (!moving) setMoving(true)
    }
  }
  const rest = (sym: symbol) => {
    if (ref.current) {
      ref.current.delete(sym)
      if (moving && ref.current.size === 0) {
        dis(nextReductionStage())
        setMoving(false)
      }
    }
  }
  return { start, rest }
}
const useOrderedKeys = () => {
  const coords = useCoords()
  const highlighted = useHighlighted()
  const selected = useSelected()
  const reduction = useReduction()
  return Object.keys(coords).sort((a, b) => {
    const nodeID = coords[a].nodeID
    if (nodeID === highlighted || nodeID === selected) return 1
    if (reduction) {
      if (
        nodeID === reduction.consumed ||
        Object.values(reduction.substitutions)
          .map(sub => sub[reduction.consumed])
          .indexOf(nodeID) !== -1
      )
        return 1
    }
    return coords[a].x - coords[b].x || coords[b].w - coords[a].w
  })
}
