import React from "react"
import { animated } from "react-spring"
import {
  useDimensions,
  useEvents,
  AbsStyle,
  useStyle,
  useCoord,
  NodeID,
  DimensionSettings,
  NodeEvents,
  NodeStyle,
  NodeCoord
} from "../../state"
import { ExprProps, RawExprProps, ExprElements, ExprElementValues } from "./base"

const Abs = (nodeID: NodeID, events: NodeEvents, style: NodeStyle, coord: NodeCoord, dimensions: DimensionSettings) => {
  if (!style || !coord || style.type !== "ABS_STYLE") return []
  return RawAbs({
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

export default Abs

interface RawAbsProps extends RawExprProps {
  height: number
  heightMargin: number
  radius: number
  style: AbsStyle
  width: number
  widthMargin: number
}

const RawAbs = (props: RawAbsProps): ExprElementValues[] => {
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
      key: `${props.id}_output`,
      animated: {
        d: outPath,
        fill: props.style.output.fill,
        ...props.style.output.stroke
      },
      static: staticProps
    },
    {
      key: `${props.id}_input`,
      animated: {
        d: inPath,
        fill: props.style.input.fill,
        ...props.style.input.stroke
      },
      static: staticProps
    },
    {
      key: `${props.id}_box`,
      animated: { d: boxPath, fill: props.style.fill, ...props.style.stroke },
      static: { ...staticProps, pointerEvents: "stroke" }
    }
  ]
}
