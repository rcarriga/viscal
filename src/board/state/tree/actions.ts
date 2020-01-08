import { NodeID, VarIndex } from "./types"
export const NORMAL_ORDER_REDUCTION = "NORMAL_ORDER_REDUCTION"
export const SET_ROOT = "SET_ROOT"
export const ADD_VARIABLE = "ADD_VARIABLE"
export const ADD_ABSTRACTION = "ADD_ABSTRACTION"
export const ADD_APPLICATION = "ADD_APPLICATION"

interface NormalOrderReductionAction {
  type: typeof NORMAL_ORDER_REDUCTION
  expressionID: NodeID
}

interface SetRoot {
  type: typeof SET_ROOT
  expressionID: NodeID
}

interface AddExpression {
  expressionID: NodeID
}

interface AddVariable extends AddExpression {
  type: typeof ADD_VARIABLE
  index: VarIndex
  name: string
  parentID?: NodeID
}

interface AddAbstraction extends AddExpression {
  type: typeof ADD_ABSTRACTION
  variableName: string
  child?: NodeID
  parentID?: NodeID
}

interface AddApplication extends AddExpression {
  type: typeof ADD_APPLICATION
  left: NodeID
  right: NodeID
  parentID?: NodeID
}

export type TreeAction =
  | NormalOrderReductionAction
  | SetRoot
  | AddVariable
  | AddAbstraction
  | AddApplication

export function normalOrderReduce(expressionID: NodeID): TreeAction {
  return { type: NORMAL_ORDER_REDUCTION, expressionID: expressionID }
}

export function setRoot(expressionID: NodeID): TreeAction {
  return { type: SET_ROOT, expressionID: expressionID }
}

export function addVariable(
  exprID: NodeID,
  index: VarIndex,
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
  child?: NodeID,
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
  left: NodeID,
  right: NodeID,
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
