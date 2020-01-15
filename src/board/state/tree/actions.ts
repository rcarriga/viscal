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
}

interface AddAbstraction extends AddExpression {
  type: "ADD_ABSTRACTION"
  variableName: string
  child?: NodeID
}

interface AddApplication extends AddExpression {
  type: "ADD_APPLICATION"
  left: NodeID
  right: NodeID
}

interface QueueReduction {
  type: "QUEUE_REDUCTION"
  applicationID: NodeID
}

interface NextReductionStage {
  type: "NEXT_REDUCTION_STAGE"
}

export type TreeAction =
  | NormalOrderReductionAction
  | SetRoot
  | AddVariable
  | AddAbstraction
  | AddApplication
  | QueueReduction
  | NextReductionStage

export const normalOrderReduce = (nodeID: NodeID): TreeAction => {
  return { type: "NORMAL_ORDER_REDUCTION", nodeID }
}

export const setRoot = (nodeID: NodeID): TreeAction => {
  return { type: "SET_ROOT", nodeID: nodeID }
}

export const addVariable = (nodeID: NodeID, index: VarIndex, name: string): TreeAction => ({
  type: "ADD_VARIABLE",
  nodeID,
  index,
  name
})

export const addAbstraction = (
  nodeID: NodeID,
  variableName: string,
  child?: NodeID
): TreeAction => ({
  type: "ADD_ABSTRACTION",
  nodeID,
  variableName,
  child
})

export const addApplication = (nodeID: NodeID, left: NodeID, right: NodeID): TreeAction => ({
  type: "ADD_APPLICATION",
  nodeID,
  left,
  right
})

export const queueReduction = (applicationID: NodeID): TreeAction => ({
  type: "QUEUE_REDUCTION",
  applicationID
})

export const nextReductionStage = (): TreeAction => ({
  type: "NEXT_REDUCTION_STAGE"
})
