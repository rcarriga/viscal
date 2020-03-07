import { ApplStyle, NodeID, DimensionSettings, NodeEvents, NodeStyle, NodeCoord } from "board/state"
import { RawExprProps, ExprElementValues } from "./types"

const applElements = (
  nodeID: NodeID,
  events: NodeEvents,
  style: NodeStyle,
  coord: NodeCoord,
  dimensions: DimensionSettings
) => {
  if (!style || !coord || style.type !== "APPL_STYLE") return []
  return rawApplElements({
    id: nodeID,
    height: coord.h,
    heightMargin: dimensions.heightMargin,
    radius: dimensions.circleRadius,
    style: style,
    events,
    width: coord.w,
    x: coord.x,
    y: coord.y
  })
}

export default applElements

interface RawApplProps extends RawExprProps {
  radius: number
  heightMargin: number
  width: number
  height: number
  style: ApplStyle
}

const rawApplElements = (props: RawApplProps): ExprElementValues[] => {
  const boxWidth = props.width - props.radius
  const bufferOffset = 1
  const circleBuffer = props.height / 2 - props.radius - bufferOffset
  const outPath = `M${props.x + props.radius},${props.y - props.radius}
        a1,1 0 0,0 0,${props.radius * 2}`
  const boxPath = `M${props.x + props.radius},${props.y + props.radius}
        l0,${bufferOffset}
        l${props.heightMargin},${circleBuffer}
        l${boxWidth - props.heightMargin * 2},0
        l${props.heightMargin},${-circleBuffer}
        l0,${-bufferOffset}
        l0,${-props.radius * 2}
        l0,${-bufferOffset}
        l${-props.heightMargin},${-circleBuffer}
        l${props.heightMargin * 2 - boxWidth},0
        l${-props.heightMargin},${circleBuffer}
        l0,${bufferOffset + props.radius * 2}`

  const staticProps = {
    onClick: (e: any) => {
      e.stopPropagation()
      props.events.click(props.id)
    },
    onMouseOver: () => props.events.highlight(props.id),
    onMouseLeave: () => props.events.clearHighlight(props.id)
  }
  return [
    {
      type: "PATH",
      key: `${props.id}_output`,
      animated: {
        d: outPath,
        fill: props.style.output.fill,
        ...props.style.output.stroke
      },
      static: staticProps
    },
    {
      type: "PATH",
      key: `${props.id}_box`,
      animated: {
        d: boxPath,
        fill: props.style.fill,
        ...props.style.stroke
      },
      static: { ...staticProps, pointerEvents: "stroke" }
    }
  ]
}
