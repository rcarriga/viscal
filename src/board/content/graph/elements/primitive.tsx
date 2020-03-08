import { PrimStyle, NodeID, NodeStyle, NodeCoord, DimensionSettings, Primitive } from "board/state"

import _ from "lodash"
import { RawExprProps, NodeEvents, ExprElementValues } from "./types"

const primElements = (
  nodeID: NodeID,
  events: NodeEvents,
  style: NodeStyle,
  coord: NodeCoord,
  dimensions: DimensionSettings,
  primitive: Primitive
): ExprElementValues[] => {
  if (!style || !coord || !primitive || style.type !== "PRIM_STYLE") return []
  return rawPrimElements({
    id: nodeID,
    events: events,
    height: coord.h,
    heightMargin: dimensions.heightMargin,
    radius: dimensions.circleRadius,
    style: style,
    width: coord.w,
    widthMargin: dimensions.widthMargin,
    name: primitive.name,
    x: coord.x,
    y: coord.y
  })
}

export default primElements

interface RawPrimProps extends RawExprProps {
  height: number
  heightMargin: number
  radius: number
  style: PrimStyle
  width: number
  widthMargin: number
  name: string
}

const rawPrimElements = (props: RawPrimProps): ExprElementValues[] => {
  const boxWidth = props.width - props.radius
  const circleTopPoint = props.y - props.radius
  const bufferOffset = 1
  const circleBuffer = props.height / 2 - props.radius - bufferOffset
  const boxPath = `M${props.x + props.radius},${circleTopPoint}
        a1,1 0 0,0 0,${props.radius * 2}
        l${props.heightMargin},${circleBuffer + bufferOffset}
        l${boxWidth - props.heightMargin * 2},0
        l${props.heightMargin},${-circleBuffer}
        l0,${-bufferOffset}
        a1,1 0 1,1 0,${-props.radius * 2}
        l0,${-bufferOffset}
        l${-props.heightMargin},${-circleBuffer}
        l${props.heightMargin * 2 - boxWidth},0
        l${-props.heightMargin},${circleBuffer + bufferOffset}
        l${-1},0`

  const calculatedFontSize = props.radius * 2 - (props.name.length > 3 ? (props.name.length - 3) * 7 : 0)
  const fontSize = calculatedFontSize > 2 ? calculatedFontSize : 3

  const staticProps = _.mapValues(props.events, handler => (e: any) => {
    e.stopPropagation()
    handler(props.id)
  })

  return [
    {
      type: "PATH",
      key: `${props.id}_prim`,
      animated: { d: boxPath, fill: props.style.fill, ...props.style.stroke },
      static: staticProps
    },
    {
      type: "TEXT",
      key: `${props.id}_text`,
      text: props.name,
      animated: {
        x: props.x + props.radius * 2,
        y: props.y + fontSize / 3,
        fontSize,
        ...props.style.text
      },
      static: staticProps
    }
  ]
}
