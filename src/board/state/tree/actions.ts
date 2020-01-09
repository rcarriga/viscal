import { NodeID, VarIndex } from "./types"

interface NormalOrderReductionAction {
  type: "NORMAL_ORDER_REDUCTION"
  nodeID: NodeID
}

interface SetRoot {
  type: "SET_ROOT"
  nodeID: NodeID
}

interface AddExpression {
  nodeID: NodeID
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

export const normalOrderReduce = (nodeID: NodeID): TreeAction => {
  return { type: "NORMAL_ORDER_REDUCTION", nodeID }
}

export const setRoot = (nodeID: NodeID): TreeAction => {
  return { type: "SET_ROOT", nodeID: nodeID }
}

export const addVariable = (
  nodeID: NodeID,
  index: VarIndex,
  name: string,
  parentID?: NodeID
): TreeAction => {
  return {
    type: "ADD_VARIABLE",
    nodeID,
    parentID,
    index,
    name
  }
}

export const addAbstraction = (
  nodeID: NodeID,
  variableName: string,
  child?: NodeID,
  parentID?: NodeID
): TreeAction => {
  return {
    type: "ADD_ABSTRACTION",
    nodeID,
    parentID,
    variableName,
    child
  }
}

export const addApplication = (
  nodeID: NodeID,
  left: NodeID,
  right: NodeID,
  parentID?: NodeID
): TreeAction => {
  return {
    type: "ADD_APPLICATION",
    parentID,
    nodeID,
    left,
    right
  }
}
