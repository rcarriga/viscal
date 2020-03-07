import { reducers } from "board/calculus"
import { ExprElements } from "board/content/elements/base"
import Prim from "board/content/elements/primitive"
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
  useStyles,
  useEvents,
  useDimensions,
  useLayout,
  useTree,
  usePrimitives
} from "board/state"
import React, { useRef, Ref } from "react"
import { ActionCreators } from "redux-undo"
import Abs from "./abstraction"
import Appl from "./application"
import Var from "./variable"

const Graph = () => {
  const coords = useCoords()
  const keys = useOrderedKeys()
  const onStop = useAnimationControl()
  const styles = useStyles()
  const events = useEvents()
  const layout = useLayout()
  const tree = useTree()
  const dimensions = useDimensions()
  const primitives = usePrimitives()
  const { start, rest } = useMotionTrackers(onStop)
  const values = keys.flatMap(nodeID => {
    const coord = { ...coords[nodeID], x: coords[nodeID].x + layout.startX, y: coords[nodeID].y + layout.startY }
    const node = tree[nodeID]
    if (node.primitives.length) {
      const primitive = primitives[node.primitives[node.primitives.length - 1]]
      return Prim(nodeID, events, styles[nodeID], coord, dimensions, primitive)
    }
    switch (node.type) {
      case "VARIABLE":
        return Var(nodeID, events, styles[nodeID], coord)
      case "ABSTRACTION":
        return Abs(nodeID, events, styles[nodeID], coord, dimensions)
      case "APPLICATION":
        return Appl(nodeID, events, styles[nodeID], coord, dimensions)
      default:
        return []
    }
  })
  return <ExprElements values={values} onRest={rest} onStart={start} />
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
  const isMoving = useRef(false)
  const start = (sym: string) => {
    if (movingSet.current) {
      movingSet.current.add(sym)
      if (!isMoving.current) {
        isMoving.current = true
      }
    }
  }
  const rest = (sym: string) => {
    if (movingSet.current) {
      movingSet.current.delete(sym)
      if (movingSet.current.size === 0) {
        console.log("all stopped")
        onStop()
        isMoving.current = false
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
