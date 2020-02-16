import { useCoords, useStyles, useHighlighted, useSelected, useReduction } from "board/state"
import { mapObj } from "board/util"
import React from "react"
import Abs from "./abstraction"
import Appl from "./application"
import Var from "./variable"

const TreeGraph = () => {
  const coords = useCoords()
  const styles = useStyles()
  const highlighted = useHighlighted()
  const selected = useSelected()
  const reduction = useReduction()
  return (
    <g>
      {Object.keys(coords)
        .sort((a, b) => {
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
        .map(coordID => {
          const style = styles[coordID]
          if (!style) return null
          switch (style.type) {
            case "VAR_STYLE":
              return <Var key={coordID} id={coordID} />
            case "ABS_STYLE":
              return <Abs key={coordID} id={coordID} />
            case "APPL_STYLE":
              return <Appl key={coordID} id={coordID} />
            default:
              return null
          }
        })}
    </g>
  )
}

export default TreeGraph
