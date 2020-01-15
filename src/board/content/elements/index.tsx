import _ from "lodash"
import React from "react"
import { Coords, BoardState } from "../../state"
import { Var, Abs, Appl } from "./static"

interface TreeGraphProps {
  coords: Coords
  board: BoardState
}

export const TreeGraph = (props: TreeGraphProps) => (
  <g>
    {_.sortBy(
      _.omitBy(
        _.map(props.board.tree.nodes, (node, nodeID) => {
          if (props.coords[nodeID])
            switch (node.type) {
              case "VARIABLE":
                return <Var key={nodeID} id={nodeID} variableName={node.name} />
              case "ABSTRACTION":
                return <Abs key={nodeID} id={nodeID} variableName={node.variableName} />
              case "APPLICATION":
                return <Appl key={nodeID} id={nodeID} />
              default:
            }
        }),
        _.isNil
      ),
      expr => props.coords[expr.props.id].x
    )}
  </g>
)
