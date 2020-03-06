import React from "react"
import { animated } from "react-spring"
import { useDimensions, useEvents, useNodePrimitive, PrimStyle, useStyle, useCoord } from "../../state"
import { ExprProps, RawExprProps } from "./base"

const Prim = (props: ExprProps) => {
  return <div></div>
}
//   const dimensions = useDimensions()
//   const events = useEvents()
//   const style = useStyle(props.id)
//   const coord = useCoord(props.id)
//   const primitive = useNodePrimitive(props.id)
//   if (!style || !coord || !primitive || style.type !== "PRIM_STYLE") return null
//   return (
//     <RawPrim
//       id={props.id}
//       events={events}
//       height={coord.h}
//       heightMargin={dimensions.heightMargin}
//       radius={dimensions.circleRadius}
//       style={style}
//       width={coord.w}
//       widthMargin={dimensions.widthMargin}
//       name={primitive.name}
//       x={coord.x}
//       y={coord.y}
//     />
//   )
// }
//
export default Prim
//
// interface RawPrimProps extends RawExprProps {
//   height: number
//   heightMargin: number
//   radius: number
//   style: PrimStyle
//   width: number
//   widthMargin: number
//   name: string
// }
//
// const RawPrim = (props: RawPrimProps) => {
//   const boxWidth = props.width - props.radius
//   const circleTopPoint = props.y - props.radius
//   const bufferOffset = 1
//   const circleBuffer = props.height / 2 - props.radius - bufferOffset
//   const boxPath = `M${props.x + props.radius},${circleTopPoint}
//         a1,1 0 0,0 0,${props.radius * 2}
//         l${props.heightMargin},${circleBuffer + bufferOffset}
//         l${boxWidth - props.heightMargin * 2},0
//         l${props.heightMargin},${-circleBuffer}
//         l0,${-bufferOffset}
//         a1,1 0 1,1 0,${-props.radius * 2}
//         l0,${-bufferOffset}
//         l${-props.heightMargin},${-circleBuffer}
//         l${props.heightMargin * 2 - boxWidth},0
//         l${-props.heightMargin},${circleBuffer + bufferOffset}
//         l${-1},0`
//
//   const animatePaths = useMotion({ d: boxPath, fill: props.style.fill, ...props.style.stroke }, props.rest, props.start)
//   const fontSize = props.radius * 2 - (props.name.length > 3 ? (props.name.length - 3) * 6 : 0)
//   const animateText = useMotion(
//     {
//       x: props.x + props.radius * 2,
//       y: props.y + fontSize / 3,
//       fontSize,
//       ...props.style.text
//     },
//     props.rest,
//     props.start
//   )
//
//   return (
//     <animated.g id={props.id}>
//       <animated.path
//         {...animatePaths}
//         onClick={e => {
//           e.stopPropagation()
//           props.events.click(props.id)
//         }}
//         onMouseOver={() => props.events.highlight(props.id)}
//         onMouseLeave={() => props.events.clearHighlight(props.id)}
//       />
//       <animated.path
//         {...animatePaths}
//         onClick={e => {
//           e.stopPropagation()
//           props.events.click(props.id)
//         }}
//         onMouseOver={() => props.events.highlight(props.id)}
//         onMouseLeave={() => props.events.clearHighlight(props.id)}
//       />
//       <animated.path {...animatePaths} onClick={() => props.events.click(props.id)} pointerEvents="stroke" />
//       <animated.text {...animateText}>{props.name}</animated.text>
//     </animated.g>
//   )
// }
