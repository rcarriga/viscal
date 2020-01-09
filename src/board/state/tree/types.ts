export type NodeID = string
export type VarName = string
export type VarIndex = number

interface BaseExpression {
  readonly children: NodeID[]
  readonly parentID?: NodeID
}

interface Variable extends BaseExpression {
  readonly type: "VARIABLE"
  readonly index: VarIndex
  readonly name: VarName
}

interface Abstraction extends BaseExpression {
  readonly type: "ABSTRACTION"
  readonly variableName: VarName
}

interface Application extends BaseExpression {
  readonly type: "APPLICATION"
  readonly left: NodeID
  readonly right: NodeID
}

export type TreeNode = Variable | Abstraction | Application

export type Tree = { [nodeId: string]: TreeNode }

export interface TreeState {
  readonly root?: NodeID
  readonly nodes: Tree
}
