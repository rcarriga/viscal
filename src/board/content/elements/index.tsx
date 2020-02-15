import { mapTree, useTreeState, NodeID, REDUCTION_STAGES } from "board/state"
import React from "react"
import Abs from "./abstraction"
import Appl from "./application"
import Var from "./variable"

const TreeGraph = () => {
  const treeState = useTreeState()
  if (!treeState.root) return null
  const drawTree = (root: NodeID) =>
    Object.values(
      mapTree(
        treeState.nodes,
        (node, nodeID) => {
          switch (node.type) {
            case "VARIABLE":
              return <Var key={nodeID} id={nodeID} />
            case "ABSTRACTION":
              return <Abs key={nodeID} id={nodeID} />
            case "APPLICATION":
              return <Appl key={nodeID} id={nodeID} />
            default:
          }
        },
        root
      )
    )

  const drawReduction = () => {
    const reduction = treeState.reduction
    if (reduction && REDUCTION_STAGES.indexOf(reduction.type) < 5)
      return Object.values(reduction.substitutions).reduce(
        (drawn: any[], sub) => [...drawn, ...drawTree(sub[reduction.consumed])],
        []
      )
    return []
  }

  return <g>{[...drawReduction(), ...drawTree(treeState.root)]}</g>
}

export default TreeGraph
