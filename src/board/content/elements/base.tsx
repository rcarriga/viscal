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

export type ExprElementValues = { key: string; animated: any; static: any }
export interface ExprElementProps {
  values: ExprElementValues[]
  onRest?: (name: string) => void
  onStart?: (name: string) => void
  common: any
}

export const ExprElements = (props: ExprElementProps) => {
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
        <ExprElement
          key={value.key}
          animated={value.animated}
          static={value.static}
          rest={props.onRest}
          start={props.onStart}
        />
      ))}
    </animated.g>
  )
}

const ExprElement = (props: any) => {
  const motion = useMotion(props.animated, props.rest, props.start)
  return <animated.path {...props.static} {...motion} />
}

export const useMotion = (
  props: any,
  rest: (symbol: symbol) => void = () => {},
  start: (symbol: symbol) => void = () => {}
) => {
  const [sym] = useState(Symbol(""))
  const config = useAnimationSettings()
  return useSpring({
    to: props,
    config,
    onRest: () => rest(sym),
    onStart: () => start(sym)
  })
}

const useAnimatedProps = function(
  keys: string[],
  values: any[],
  onRest: (name: string) => void = () => {},
  onStart: (name: string) => void = () => {}
) {
  const config = useAnimationSettings()
  return useTransition(values, {
    key: keys,
    from: value => value,
    update: (value, index) => ({
      ...value,
      onRest: (...args) => {
        onRest(keys[index])
      },
      onStart: (...args) => {
        onStart(keys[index])
      }
    }),
    config
  })
}
