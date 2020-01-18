import _ from "lodash"
import React from "react"
import { Coords, BoardState } from "../../state"
import { Abs } from "./abstraction"
import { Appl } from "./application"
import { Var } from "./variable"

interface TreeGraphProps {
  board: BoardState
}

export const TreeGraph = (props: TreeGraphProps) => (
  <g>
    {_.map(props.board.tree.nodes, (node, nodeID) => {
      switch (node.type) {
        case "VARIABLE":
          return <Var key={nodeID} id={nodeID} variableName={node.name} />
        case "ABSTRACTION":
          return <Abs key={nodeID} id={nodeID} variableName={node.variableName} />
        case "APPLICATION":
          return <Appl key={nodeID} id={nodeID} />
        default:
      }
    })}
  </g>
)
