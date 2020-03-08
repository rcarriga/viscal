import { AbsStyle, NodeID, DimensionSettings, NodeStyle, NodeCoord } from "board/state"
import _ from "lodash"
import { RawExprProps, ExprElementValues, NodeEvents } from "./types"

const absElements = (
  nodeID: NodeID,
  events: NodeEvents,
  style: NodeStyle,
  coord: NodeCoord,
  dimensions: DimensionSettings
) => {
  if (!style || !coord || style.type !== "ABS_STYLE") return []
  return rawAbsElements({
    id: nodeID,
    height: coord.h,
    heightMargin: dimensions.heightMargin,
    radius: dimensions.circleRadius,
    style: style,
    events,
    width: coord.w,
    widthMargin: dimensions.widthMargin,
    x: coord.x,
    y: coord.y
  })
}

export default absElements

interface RawAbsProps extends RawExprProps {
  height: number
  heightMargin: number
  radius: number
  style: AbsStyle
  width: number
  widthMargin: number
}

const rawAbsElements = (props: RawAbsProps): ExprElementValues[] => {
  const boxWidth = props.width - props.radius
  const circleTopPoint = props.y - props.radius
  const inputX = props.x + boxWidth + props.radius
  const outPath = `M${props.x + props.radius},${circleTopPoint}
        a1,1 0 0,0 0,${props.radius * 2}`
  const inPath = `M${inputX},${circleTopPoint}
        a1,1 0 0,0 0,${props.radius * 2}
        l0,${-props.radius * 2}`
  const bufferOffset = 1
  const circleBuffer = props.height / 2 - props.radius - bufferOffset
  const boxPath = `M${props.x + props.radius},${circleTopPoint + props.radius * 2}
        l0,${bufferOffset}
        l${props.heightMargin},${circleBuffer}
        l${boxWidth - props.heightMargin * 2},0
        l${props.heightMargin},${-circleBuffer}
        l0,${-bufferOffset}
        a1,1 0 1,1 0,${-props.radius * 2}
        l0,${-bufferOffset}
        l${-props.heightMargin},${-circleBuffer}
        l${props.heightMargin * 2 - boxWidth},0
        l${-props.heightMargin},${circleBuffer}
        l0,${bufferOffset + props.radius * 2}`

  const staticProps = _.mapValues(props.events, handler => (e: any) => {
    e.stopPropagation()
    handler(props.id)
  })
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
      key: `${props.id}_input`,
      animated: {
        d: inPath,
        fill: props.style.input.fill,
        ...props.style.input.stroke
      },
      static: staticProps
    },
    {
      type: "PATH",
      key: `${props.id}_box`,
      animated: { d: boxPath, fill: props.style.fill, ...props.style.stroke },
      static: { ...staticProps, pointerEvents: "stroke" }
    }
  ]
}
