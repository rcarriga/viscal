import _ from "lodash"
import React from "react"
import { Tree, useCoords, Layout, TreeLayout, useStyles } from "../../state"
import { Abs } from "./abstraction"
import { Appl } from "./application"
import { Var } from "./variable"

interface TreeGraphProps {
  tree: Tree
  layout: TreeLayout
}

export const TreeGraph = (props: TreeGraphProps) => {
  const coords = useCoords()
  const styles = useStyles()
  return (
    <g>
      {Object.keys(coords)
        .sort((a, b) => coords[a].x - coords[b].x || coords[b].w - coords[a].w)
        .map(coordID => {
          const baseCoord = coords[coordID]
          const coord = { ...baseCoord, x: baseCoord.x + props.layout.startX, y: baseCoord.y + props.layout.startY }
          const style = styles[coordID]
          switch (style.type) {
            case "VAR_STYLE":
              return <Var key={coord.nodeID} id={coordID} coord={coord} style={style} />
            case "ABS_STYLE":
              return <Abs key={coord.nodeID} id={coordID} coord={coord} style={style} />
            case "APPL_STYLE":
              return <Appl key={coord.nodeID} id={coordID} coord={coord} style={style} />
            default:
              return null
          }
        })}
    </g>
  )
}
