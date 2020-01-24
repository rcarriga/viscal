import _ from "lodash"
import React from "react"
import { Tree, useCoords, Layout, TreeLayout } from "../../state"
import { Abs } from "./abstraction"
import { Appl } from "./application"
import { Var } from "./variable"

interface TreeGraphProps {
  tree: Tree
  layout: TreeLayout
}

export const TreeGraph = (props: TreeGraphProps) => {
  const coords = useCoords()
  return (
    <g>
      {Object.keys(coords)
        .sort((a, b) => coords[a].x - coords[b].x || coords[b].w - coords[a].w)
        .map(coordID => {
          const baseCoord = coords[coordID]
          const coord = { ...baseCoord, x: baseCoord.x + props.layout.startX, y: baseCoord.y + props.layout.startY }
          const node = props.tree[coord.nodeID]
          switch (node.type) {
            case "VARIABLE":
              return <Var key={coord.nodeID} id={coordID} coord={coord} variableName={node.name} />
            case "ABSTRACTION":
              return <Abs key={coord.nodeID} id={coordID} coord={coord} variableName={node.variableName} />
            case "APPLICATION":
              return <Appl key={coord.nodeID} id={coordID} coord={coord} />
            default:
              return null
          }
        })}
    </g>
  )
}
