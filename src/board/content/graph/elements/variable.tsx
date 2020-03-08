import { VarStyle, NodeID, NodeStyle, NodeCoord } from "board/state"
import _ from "lodash"
import { RawExprProps, ExprElementValues, NodeEvents } from "./types"

const varElements = (nodeID: NodeID, events: NodeEvents, style: NodeStyle, coord: NodeCoord): ExprElementValues[] => {
  if (!style || !coord || style.type !== "VAR_STYLE") return []
  return rawVarElements({
    id: nodeID,
    radius: coord.w / 2,
    style: style,
    events: events,
    x: coord.x,
    y: coord.y
  })
}

export default varElements

interface RawVarProps extends RawExprProps {
  radius: number
  style: VarStyle
}

const rawVarElements = (props: RawVarProps): ExprElementValues[] => {
  const path = `M${props.x},${props.y}
      a${props.radius},${props.radius} 0 1,0 ${props.radius * 2},0
      a${props.radius},${props.radius} 0 1,0 -${props.radius * 2},0`

  return [
    {
      type: "PATH",
      key: `${props.id}_var`,
      animated: {
        d: path,
        fill: props.style.fill,
        ...props.style.stroke
      },
      static: _.mapValues(props.events, handler => (e: any) => {
        e.stopPropagation()
        handler(props.id)
      })
    }
  ]
}
