import React from 'react';
import {Motion, spring} from "react-motion"
import {ExprProps} from "./base"

class VariableProps extends ExprProps {
  fill: string = ""
  free: boolean = false
}

export function Variable(props: VariableProps) {
  return <circle cx={props.x} cy={props.y} r={50} fill={props.fill} ></circle>
}
