export type NodeID = string
export type VarName = string
export type VarIndex = number

interface BaseExpression {
  readonly children: (tree: Tree) => NodeID[]
}

interface NullExpression extends BaseExpression {
  readonly type: "NULL"
}

interface Variable extends BaseExpression {
  readonly type: "VARIABLE"
  readonly index: VarIndex
  readonly name: VarName
  readonly binder: (tree: TreeState) => NodeID | undefined
}

interface Abstraction extends BaseExpression {
  readonly type: "ABSTRACTION"
  readonly child?: NodeID
  readonly variableName: VarName
}

interface Application extends BaseExpression {
  readonly type: "APPLICATION"
  readonly left: NodeID
  readonly right: NodeID
}

export type TreeNode = NullExpression | Variable | Abstraction | Application

export type Tree = { [nodeId: string]: TreeNode }

export type ReductionStage = "CONSUME" | "UNBIND" | "SUBSTITUTE"

export interface Reduction {
  stage: ReductionStage
  applicationID: NodeID
}

export interface TreeState {
  readonly root?: NodeID
  readonly nodes: Tree
  readonly reductions: Reduction[]
}

export const initialTreeState: TreeState = { nodes: {}, reductions: [] }
