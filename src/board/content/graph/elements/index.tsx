import primElements from "board/content/graph/elements/primitive"
import {
  useAnimationSettings,
  useStyles,
  useEvents,
  useLayout,
  useTree,
  useDimensions,
  usePrimitives,
  useCoords,
  NodeID
} from "board/state"
import React from "react"
import { useSpring, animated, AnimatedValue } from "react-spring"
import absElements from "./abstraction"
import applElements from "./application"
import { ExprElementValues } from "./types"
import varElements from "./variable"

export * from "./types"

export interface ExprElementsProps {
  orderedKeys: NodeID[]
  onRest?: (name: string) => void
  onStart?: (name: string) => void
}

const ExprElements = (props: ExprElementsProps) => {
  const styles = useStyles()
  const events = useEvents()
  const layout = useLayout()
  const tree = useTree()
  const dimensions = useDimensions()
  const primitives = usePrimitives()
  const coords = useCoords()
  const values = props.orderedKeys.flatMap(nodeID => {
    const coord = { ...coords[nodeID], x: coords[nodeID].x + layout.startX, y: coords[nodeID].y + layout.startY }
    const node = tree[nodeID]
    if (node.primitives.length) {
      const primitive = primitives[node.primitives[node.primitives.length - 1]]
      return primElements(nodeID, events, styles[nodeID], coord, dimensions, primitive)
    }
    switch (node.type) {
      case "VARIABLE":
        return varElements(nodeID, events, styles[nodeID], coord)
      case "ABSTRACTION":
        return absElements(nodeID, events, styles[nodeID], coord, dimensions)
      case "APPLICATION":
        return applElements(nodeID, events, styles[nodeID], coord, dimensions)
      default:
        return []
    }
  })
  // const animatedProps = useAnimatedProps(
  //   props.values.map(v => v.key),
  //   props.values.map(v => v.animated),
  //   props.onRest,
  //   props.onStart
  // )
  // {animatedProps((animatedProp, item, __, index) => {
  //   return <animated.path {...props.common} {...props.values[index].static} {...animatedProp} />
  // })}
  return (
    <animated.g>
      {values.map(value => (
        <ExprElement key={value.key} name={value.key} {...value} onRest={props.onRest} onStart={props.onStart} />
      ))}
    </animated.g>
  )
}

export default ExprElements

export type ExprElementProps = ExprElementValues & {
  name: string
  onRest?: (name: string) => void
  onStart?: (name: string) => void
}

const ExprElement = (props: ExprElementProps) => {
  return (
    <Motion
      name={props.name}
      values={props.animated}
      onRest={() => props.onRest && props.onRest(props.name)}
      onStart={() => props.onStart && props.onStart(props.name)}
    >
      {animatedProps => {
        switch (props.type) {
          case "TEXT":
            return (
              <animated.text {...props.static} {...animatedProps}>
                {props.text}
              </animated.text>
            )
          default:
            return <animated.path {...props.static} {...animatedProps} />
        }
      }}
    </Motion>
  )
}
//
export const Motion = (props: {
  name: string
  values: any
  onRest?: (name: string) => void
  onStart?: (name: string) => void
  children: (values: AnimatedValue<any>) => any
}) => {
  const config = useAnimationSettings()
  const motionVals = useSpring({
    to: props.values,
    onRest: () => props.onRest && props.onRest(props.name),
    onStart: () => props.onStart && props.onStart(props.name),
    config
  })
  return props.children(motionVals)
}

// const useAnimatedProps = function(
//   keys: string[],
//   values: any[],
//   onRest: (name: string) => void = () => {},
//   onStart: (name: string) => void = () => {}
// ) {
//   const config = useAnimationSettings()
//   return useTransition(values, {
//     key: keys,
//     from: value => value,
//     update: (value, index) => ({
//       ...value,
//       onRest: (...args) => {
//         onRest(keys[index])
//       },
//       onStart: (...args) => {
//         onStart(keys[index])
//       }
//     }),
//     config
//   })
// }
