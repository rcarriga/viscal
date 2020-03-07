import { NodeEvents, useAnimationSettings, NodeID } from "board/state"
import _ from "lodash"
import React, { useState, useRef } from "react"

import { useSpring, useTransition, animated } from "react-spring"

export interface ExprProps {
  id: string
}

export interface RawExprProps extends ExprProps {
  x: number
  y: number
  events: NodeEvents
}

export interface BaseElementValues {
  type: string
  key: string
  animated: any
  static: any
}

export interface PathElementValues extends BaseElementValues {
  type: "PATH"
}

export interface TextElementValues extends BaseElementValues {
  type: "TEXT"
  text: string
}

export type ExprElementValues = PathElementValues | TextElementValues

export interface ExprElementsProps {
  values: ExprElementValues[]
  onRest?: (name: string) => void
  onStart?: (name: string) => void
}

export const ExprElements = (props: ExprElementsProps) => {
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
      {props.values.map(value => (
        <ExprElement key={value.key} name={value.key} {...value} onRest={props.onRest} onStart={props.onStart} />
      ))}
    </animated.g>
  )
}

export type ExprElementProps = ExprElementValues & {
  name: string
  onRest?: (name: string) => void
  onStart?: (name: string) => void
}

const ExprElement = (props: ExprElementProps) => {
  const motion = useMotion(props.key, props.animated, props.onRest, props.onStart)
  switch (props.type) {
    case "TEXT":
      return (
        <animated.text {...props.static} {...motion}>
          {props.text}
        </animated.text>
      )
    default:
      return <animated.path {...props.static} {...motion} />
  }
}

export const useMotion = (
  name: string,
  props: any,
  rest: (name: string) => void = () => {},
  start: (name: string) => void = () => {}
) => {
  const config = useAnimationSettings()
  return useSpring({
    to: props,
    config,
    onRest: () => rest(name),
    onStart: () => start(name)
  })
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
