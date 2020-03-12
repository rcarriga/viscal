import primElements from "board/content/graph/elements/primitive"
import { useAnimationSettings, useStyles, useTree, useDimensions, usePrimitives, useCoords, NodeID } from "board/state"
import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import absElements from "./abstraction"
import applElements from "./application"
import { ExprElementValues, NodeEvents } from "./types"
import varElements from "./variable"

export * from "./types"

export interface ExprElementsProps {
  events: NodeEvents
  orderedKeys: NodeID[]
  onRest?: (name: string) => void
  onStart?: (name: string) => void
}

const ExprElements = (props: ExprElementsProps) => {
  const styles = useStyles()
  const tree = useTree()
  const dimensions = useDimensions()
  const primitives = usePrimitives()
  const coords = useCoords()
  const values = props.orderedKeys.flatMap(nodeID => {
    const coord = coords[nodeID]
    const node = tree[nodeID]
    if (node.primitives.length) {
      const primitive = primitives[node.primitives[node.primitives.length - 1]]
      return primElements(nodeID, props.events, styles[nodeID], coord, dimensions, primitive)
    }
    switch (node.type) {
      case "VARIABLE":
        return varElements(nodeID, props.events, styles[nodeID], coord)
      case "ABSTRACTION":
        return absElements(nodeID, props.events, styles[nodeID], coord, dimensions)
      case "APPLICATION":
        return applElements(nodeID, props.events, styles[nodeID], coord, dimensions)
      default:
        return []
    }
  })
  return (
    <motion.g>
      <AnimatePresence initial={false}>
        {values.map(value => (
          <ExprElement key={value.key} name={value.key} {...value} onRest={props.onRest} onStart={props.onStart} />
        ))}
      </AnimatePresence>
    </motion.g>
  )
}

export default ExprElements

export type ExprElementProps = ExprElementValues & {
  name: string
  onRest?: (name: string) => void
  onStart?: (name: string) => void
}

const ExprElement = (props: ExprElementProps) => {
  if (props.name === "Test") console.log("here")
  const config = useAnimationSettings()
  const { onRest, onStart } = props
  const elemProps = {
    ...props.static,
    onAnimationStart: () => onStart && onStart(props.name),
    onAnimationComplete: () => onRest && onRest(props.name),
    exit: {
      stroke: "rgba(0, 0, 0, 0)",
      fill: "rgba(0, 0, 0, 0)",
      transition: { type: "tween", duration: 0.1 }
    },
    transition: config,
    initial: { ...props.animated, stroke: "rgba(0, 0, 0, 0)", fill: "rgba(0, 0, 0, 0)" },
    animate: { ...props.animated }
  }
  switch (props.type) {
    case "TEXT":
      return <motion.text {...elemProps}>{props.text}</motion.text>
    default:
      return <motion.path {...elemProps} />
  }
}
