export const VARIABLE = "VARIABLE"
export const ABSTRACTION = "ABSTRACTION"
export const APPLICATION = "APPLICATION"

type NodeID = string

interface Variable {
  type: typeof VARIABLE
  parent?: NodeID
  index: number
  name: string
}

interface Abstraction {
  type: typeof ABSTRACTION
  parent?: NodeID
  variableIndex: number
  variableName: string
  child: string
}

interface Application {
  type: typeof APPLICATION
  parent?: NodeID
  left: string
  right: string
}

export type Expression = Variable | Abstraction | Application

export const NORMAL_ORDER_REDUCTION = "NORMAL_ORDER_REDUCTION"
export const SET_TREE = "SET_TREE"

interface NormalOrderReductionAction {
  type: typeof NORMAL_ORDER_REDUCTION
  expressionID: string
}

interface SetTreeAction {
  type: typeof SET_TREE
  tree: TreeState
}

export interface TreeState {
  root?: NodeID
  nodes: { [nodeId: string]: Expression }
}

export type TreeAction = NormalOrderReductionAction | SetTreeAction
