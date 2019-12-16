import React from "react"
import {Motion, spring, PlainStyle} from "react-motion"
import {ExprProps} from "./base"

class SubstitutionProps {
  elementConstructor = (_: ExprProps) => <div></div>
  elementProps: ExprProps = new ExprProps()
  raiseBy: number = 0
  shiftBy: number = 0
  lowerBy: number = 0
  stiffness: number = 50
  dampening: number = 26
}


export function Substitution(props: SubstitutionProps) {
  const startStep = (props: ExprProps) => ({
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height
  })

  const drawElement = (style: PlainStyle) =>
    <props.elementConstructor
      {...props.elementProps} x={style.x} y={style.y}
    ></props.elementConstructor>

  const Lower = () => <Motion
    defaultStyle={startStep(props.elementProps)}
    style={{
      x: spring(props.shiftBy, {stiffness: props.stiffness}),
      y: spring(props.lowerBy, {stiffness: props.stiffness}),
      width: props.elementProps.width,
      height: props.elementProps.height
    }}></Motion>

  const Shift = () =>
    <Motion
      defaultStyle={startStep(props.elementProps)}
      style={{
        x: spring(props.shiftBy, {stiffness: props.stiffness}),
        y: spring(props.lowerBy, {stiffness: props.stiffness}),
        width: props.elementProps.width,
        height: props.elementProps.height
      }}
      onRest={Lower}></Motion>

  const Raise = () =>
    <Motion
      defaultStyle={startStep(props.elementProps)}
      style={{
        x: spring(props.shiftBy, {stiffness: props.stiffness}),
        y: spring(props.lowerBy, {stiffness: props.stiffness}),
        width: props.elementProps.width,
        height: props.elementProps.height
      }}
      onRest={Shift}>
      {drawElement}
    </Motion>

  return <Raise></Raise>
}
