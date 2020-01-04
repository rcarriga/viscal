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
