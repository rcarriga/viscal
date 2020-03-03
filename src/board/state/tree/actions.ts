import { VarIndex, NodeID, VarName, ReductionStage, LambdaReducerID, PrimitiveID } from "./types"

interface ClearTree {
  type: "CLEAR_TREE"
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
  name: VarName
}

interface AddAbstraction extends AddExpression {
  type: "ADD_ABSTRACTION"
  variableName: string
  child?: NodeID
}

interface AddApplication extends AddExpression {
  type: "ADD_APPLICATION"
  left?: NodeID
  right?: NodeID
}

interface QueueReduction {
  type: "QUEUE_REDUCTION"
  reduction?: ReductionStage
}

interface NextReductionStage {
  type: "NEXT_REDUCTION_STAGE"
}

interface SetConstant {
  type: "SET_CONSTANT"
  name: string
  text: string
}

interface SetReducer {
  type: "SET_REDUCER"
  reducerID: LambdaReducerID
}

interface CreatePrimitive {
  type: "CREATE_PRIMITIVE"
  name: string
  primID: PrimitiveID
  nodeID: NodeID
}
export type TreeAction =
  | ClearTree
  | SetRoot
  | AddVariable
  | AddAbstraction
  | AddApplication
  | QueueReduction
  | NextReductionStage
  | SetConstant
  | SetReducer
  | CreatePrimitive

export const clearTree = (): TreeAction => {
  return { type: "CLEAR_TREE" }
}

export const setRoot = (nodeID: NodeID): TreeAction => {
  return { type: "SET_ROOT", nodeID }
}

export const addVariable = (nodeID: NodeID, index: VarIndex, name: VarName): TreeAction => ({
  type: "ADD_VARIABLE",
  nodeID,
  index,
  name
})

export const addAbstraction = (nodeID: NodeID, variableName: VarName, child?: NodeID): TreeAction => ({
  type: "ADD_ABSTRACTION",
  nodeID,
  variableName,
  child
})

export const addApplication = (nodeID: NodeID, left?: NodeID, right?: NodeID): TreeAction => ({
  type: "ADD_APPLICATION",
  nodeID,
  left,
  right
})

export const queueReduction = (reduction?: ReductionStage): TreeAction => ({
  type: "QUEUE_REDUCTION",
  reduction
})

export const nextReductionStage = (): TreeAction => ({
  type: "NEXT_REDUCTION_STAGE"
})

export const setConstant = (name: string, text: string): TreeAction => ({
  type: "SET_CONSTANT",
  name,
  text
})

export const setReducer = (reducerID: LambdaReducerID): TreeAction => ({
  type: "SET_REDUCER",
  reducerID
})

export const createPrimitive = (name: string, primID: PrimitiveID, nodeID: NodeID): TreeAction => ({
  type: "CREATE_PRIMITIVE",
  name,
  primID,
  nodeID
})
