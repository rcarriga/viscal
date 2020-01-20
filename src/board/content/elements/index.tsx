import _ from "lodash"
import React from "react"
import { Tree } from "../../state"
import { Abs } from "./abstraction"
import { Appl } from "./application"
import { Var } from "./variable"

interface TreeGraphProps {
  tree: Tree
}

export const TreeGraph = (props: TreeGraphProps) => (
  <g>
    {_.map(props.tree, (node, nodeID) => {
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
