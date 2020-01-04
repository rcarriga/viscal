export const VARIABLE = "VARIABLE"
export const ABSTRACTION = "ABSTRACTION"
export const APPLICATION = "APPLICATION"

export type NodeID = string

interface BaseExpression {
  readonly children: string[]
}

interface Variable extends BaseExpression {
  readonly type: typeof VARIABLE
  readonly index: number
  readonly name: string
}

interface Abstraction extends BaseExpression {
  readonly type: typeof ABSTRACTION
  readonly variableName: string
}

interface Application extends BaseExpression {
  readonly type: typeof APPLICATION
  readonly left: NodeID
  readonly right: NodeID
}

export type Expression = Variable | Abstraction | Application

export interface TreeNode {
  readonly expr: Expression
  readonly parentID?: NodeID
}

export type Tree = { [nodeId: string]: TreeNode }

export interface TreeState {
  readonly root?: NodeID
  readonly nodes: Tree
}

export const NORMAL_ORDER_REDUCTION = "NORMAL_ORDER_REDUCTION"
export const SET_TREE = "SET_TREE"
export const ADD_VARIABLE = "ADD_VARIABLE"
export const ADD_ABSTRACTION = "ADD_ABSTRACTION"
export const ADD_APPLICATION = "ADD_APPLICATION"

interface NormalOrderReductionAction {
  type: typeof NORMAL_ORDER_REDUCTION
  expressionID: string
}

interface AddExpression {
  expressionID: NodeID
}

interface AddVariable extends AddExpression {
  type: typeof ADD_VARIABLE
  index: number
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

export type TreeAction = NormalOrderReductionAction | AddVariable | AddAbstraction | AddApplication
