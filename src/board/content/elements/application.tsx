import React from "react"
import { animated } from "react-spring"
import {
  useDimensions,
  useEvents,
  ApplStyle,
  useStyle,
  useCoord,
  NodeID,
  DimensionSettings,
  NodeEvents,
  NodeStyle,
  NodeCoord
} from "../../state"
import { ExprProps, RawExprProps, ExprElements, ExprElementValues } from "./base"

const Appl = (
  nodeID: NodeID,
  events: NodeEvents,
  style: NodeStyle,
  coord: NodeCoord,
  dimensions: DimensionSettings
) => {
  if (!style || !coord || style.type !== "APPL_STYLE") return []
  return RawAppl({
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

export default Appl

interface RawApplProps extends RawExprProps {
  radius: number
  heightMargin: number
  width: number
  height: number
  style: ApplStyle
}

const RawAppl = (props: RawApplProps): ExprElementValues[] => {
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
      key: `${props.id}_output`,
      animated: {
        d: outPath,
        fill: props.style.output.fill,
        ...props.style.output.stroke
      },
      static: staticProps
    },
    {
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
