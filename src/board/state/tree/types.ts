export type NodeID = string
export type RefID = string
export type VarName = string
export type VarIndex = number | undefined

export type NodeType = "NULL" | "VARIABLE" | "ABSTRACTION" | "APPLICATION"

interface BaseExpression {
  readonly type: NodeType
  readonly children: (tree: Tree) => NodeID[]
  readonly directChildren: NodeID[]
}

interface NullExpression extends BaseExpression {
  readonly type: "NULL"
}

export interface Variable extends BaseExpression {
  readonly type: "VARIABLE"
  readonly index: VarIndex
  readonly name: VarName
  readonly binder: (tree: TreeState) => NodeID | undefined
}

export interface Abstraction extends BaseExpression {
  readonly type: "ABSTRACTION"
  readonly child?: NodeID
  readonly variableName: VarName
}

export interface Application extends BaseExpression {
  readonly type: "APPLICATION"
  readonly left?: NodeID
  readonly right?: NodeID
}

export type TreeNode = NullExpression | Variable | Abstraction | Application

export type Tree = { [nodeId in NodeID]: TreeNode }

export type Substitution = { [nodeID in NodeID]: NodeID }

export type Substitutions = { [variable in NodeID]: Substitution }

export const REDUCTION_STAGES = [
  "SELECT",
  "CONSUME",
  "LIFT",
  "HOVER",
  "UNBIND",
  "SUBSTITUTE",
  "SHIFT_ABS",
  "SHIFT_PARENT",
  "REMOVE"
] as const

export interface ReductionStage {
  type: typeof REDUCTION_STAGES[number]
  visibleParent: NodeID
  parentApplication: NodeID
  abs: NodeID
  child: NodeID
  consumed: NodeID
  substitutions: Substitutions
  reducer: LambdaReducerID
}

export type LambdaReducerID = string | number

export interface TreeState {
  readonly root: NodeID
  readonly nodes: Tree
  readonly reduction?: ReductionStage
}

export const initialTreeState: TreeState = { nodes: {}, root: "" }
