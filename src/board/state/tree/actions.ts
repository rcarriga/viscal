import { NodeID, VarIndex } from "./types"

interface NormalOrderReductionAction {
  type: "NORMAL_ORDER_REDUCTION"
  expressionID: NodeID
}

interface SetRoot {
  type: "SET_ROOT"
  expressionID: NodeID
}

interface AddExpression {
  expressionID: NodeID
}

interface AddVariable extends AddExpression {
  type: "ADD_VARIABLE"
  index: VarIndex
  name: string
  parentID?: NodeID
}

interface AddAbstraction extends AddExpression {
  type: "ADD_ABSTRACTION"
  variableName: string
  child?: NodeID
  parentID?: NodeID
}

interface AddApplication extends AddExpression {
  type: "ADD_APPLICATION"
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
  return { type: "NORMAL_ORDER_REDUCTION", expressionID: expressionID }
}

export function setRoot(expressionID: NodeID): TreeAction {
  return { type: "SET_ROOT", expressionID: expressionID }
}

export function addVariable(
  exprID: NodeID,
  index: VarIndex,
  name: string,
  parentID?: NodeID
): TreeAction {
  return {
    type: "ADD_VARIABLE",
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
    type: "ADD_ABSTRACTION",
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
    type: "ADD_APPLICATION",
    left: left,
    right: right
  }
}
