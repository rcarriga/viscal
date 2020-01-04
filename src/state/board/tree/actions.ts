import {
  TreeAction,
  NodeID,
  NORMAL_ORDER_REDUCTION,
  ADD_VARIABLE,
  ADD_ABSTRACTION,
  ADD_APPLICATION
} from "./types"

export function normalOrderReduce(expressionID: string): TreeAction {
  return { type: NORMAL_ORDER_REDUCTION, expressionID: expressionID }
}

export function addVariable(
  exprID: NodeID,
  index: number,
  name: string,
  parentID?: NodeID
): TreeAction {
  return {
    type: ADD_VARIABLE,
    expressionID: exprID,
    parentID: parentID,
    index: index,
    name: name
  }
}

export function addAbstraction(
  exprID: NodeID,
  varName: string,
  child?: string,
  parentID?: NodeID
): TreeAction {
  return {
    type: ADD_ABSTRACTION,
    expressionID: exprID,
    parentID: parentID,
    variableName: varName,
    child: child
  }
}

export function addApplication(
  exprID: NodeID,
  left: string,
  right: string,
  parentID?: NodeID
): TreeAction {
  return {
    parentID: parentID,
    expressionID: exprID,
    type: ADD_APPLICATION,
    left: left,
    right: right
  }
}
