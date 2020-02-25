import reducers from "board/calculus"
import {
  useMode,
  useCoords,
  useHighlighted,
  useSelected,
  useReduction,
  useDispatch,
  nextReductionStage,
  queueReduction,
  useTreeState,
  setMode,
  REDUCTION_STAGES
} from "board/state"
import React, { useRef, Ref, useState } from "react"
import { ActionCreators } from "redux-undo"
import Abs from "./abstraction"
import Appl from "./application"
import Var from "./variable"

const Graph = () => {
  const coords = useCoords()
  const keys = useOrderedKeys()
  const onStop = useAnimationControl()
  const { start, rest } = useMotionTrackers(onStop)
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

const useAnimationControl = () => {
  const dis = useDispatch()
  const tree = useTreeState()
  const reduction = useReduction()
  const mode = useMode()
  return () => {
    switch (mode) {
      case "PLAY":
        if (reduction) dis(nextReductionStage())
        else {
          const next = reducers.normal.reduce(tree)
          if (next) dis(queueReduction(next))
          else dis(setMode("STOP"))
        }
        break
      case "FORWARD":
        if (!reduction) dis(queueReduction(reducers.normal.reduce(tree)))
        else {
          dis(nextReductionStage())
          if (reduction.type === REDUCTION_STAGES[REDUCTION_STAGES.length - 1]) dis(setMode("STOP"))
        }

        break
      case "REVERSE":
        dis(ActionCreators.undo())
        if (reduction && reduction.type === REDUCTION_STAGES[0]) dis(setMode("STOP"))
        break
      case "STOP":
      default:
    }
  }
}

const useMotionTrackers = (onStop: () => void) => {
  const movingSet: Ref<Set<symbol>> = useRef(new Set([]))
  const isMoving = useRef(false)
  const start = (sym: symbol) => {
    if (movingSet.current) {
      movingSet.current.add(sym)
      if (!isMoving.current) {
        isMoving.current = true
      }
    }
  }
  const rest = (sym: symbol) => {
    if (movingSet.current) {
      movingSet.current.delete(sym)
      if (movingSet.current.size === 0) {
        isMoving.current = false
        onStop()
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
