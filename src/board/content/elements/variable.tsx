import { VarStyle, NodeID, NodeStyle, NodeCoord, NodeEvents } from "../../state"
import { RawExprProps, ExprElementValues } from "./base"

const Var = (nodeID: NodeID, events: NodeEvents, style: NodeStyle, coord: NodeCoord) => {
  if (!style || !coord || style.type !== "VAR_STYLE") return []
  return RawVar({
    id: nodeID,
    radius: coord.w / 2,
    style: style,
    events: events,
    x: coord.x,
    y: coord.y
  })
}

export default Var

interface RawVarProps extends RawExprProps {
  radius: number
  style: VarStyle
}

const RawVar = (props: RawVarProps): ExprElementValues[] => {
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
      static: {
        onClick: (e: any) => {
          e.stopPropagation()
          props.events.click(props.id)
        },
        onMouseOver: () => props.events.highlight(props.id),
        onMouseLeave: () => props.events.clearHighlight(props.id)
      }
    }
  ]
}
