import { reducers } from "board/calculus"
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
  useReducer,
  REDUCTION_STAGES,
  setSelected,
  setHighlighted
} from "board/state"
import React, { useRef, Ref, useState } from "react"
import { ActionCreators } from "redux-undo"
import ExprElements, { NodeEvents } from "./elements"

const Graph = () => {
  const keys = useOrderedKeys()
  const onStop = useAnimationControl()
  const { start, rest } = useMotionTrackers(onStop)
  const events = useEvents()
  return <ExprElements events={events} orderedKeys={keys} onRest={rest} onStart={start} />
}

export default Graph

const useAnimationControl = () => {
  const dis = useDispatch()
  const tree = useTreeState()
  const reduction = useReduction()
  const reducer = reducers[useReducer() || ""] || { useReduction: () => undefined }
  const nextReduction = () => reducer.useReduction(tree)
  const mode = useMode()
  return () => {
    switch (mode) {
      case "PLAY":
        if (reduction) dis(nextReductionStage())
        else {
          const next = nextReduction()
          if (next) dis(queueReduction(next))
          else dis(setMode("STOP"))
        }
        break
      case "FORWARD":
        if (!reduction) dis(queueReduction(nextReduction()))
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
  const movingSet: Ref<Set<string>> = useRef(new Set([]))
  const [isMoving, setMoving] = useState(false)
  const start = (sym: string) => {
    if (movingSet.current) {
      movingSet.current.add(sym)
      if (!isMoving) {
        setMoving(true)
      }
    }
  }
  const rest = (sym: string) => {
    if (movingSet.current) {
      movingSet.current.delete(sym)
      if (movingSet.current.size === 0) {
        onStop()
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
          .map(sub => sub.nodes[reduction.consumed])
          .indexOf(nodeID) !== -1
      )
        return 1
    }
    return coords[a].x - coords[b].x || coords[b].w - coords[a].w
  })
}

const useEvents = (): NodeEvents => {
  const dis = useDispatch()
  const [events] = useState({
    onClick: nodeID => {
      dis(setSelected(nodeID))
    },
    onMouseOver: nodeID => {
      dis(setHighlighted(nodeID))
    },
    onMouseLeave: () => {
      dis(setHighlighted())
    }
  } as NodeEvents)
  return events
}
