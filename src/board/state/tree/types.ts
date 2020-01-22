export type NodeID = string
export type VarName = string
export type VarIndex = number | undefined

interface BaseExpression {
  readonly children: (tree: Tree) => NodeID[]
  readonly directChildren: NodeID[]
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
  readonly left?: NodeID
  readonly right?: NodeID
}

export type TreeNode = NullExpression | Variable | Abstraction | Application

export type Tree = { [nodeId: string]: TreeNode }

export type Substitution = { [nodeID in NodeID]: NodeID }

export type Substitutions = { [variable in NodeID]: Substitution }

interface Apply {
  type: "APPLY"
  parent: NodeID
  substitutions: Substitutions
}

interface Consume {
  type: "CONSUME"
  parent: NodeID
  substitutions: Substitutions
}

interface Unbind {
  type: "UNBIND"
  parent: NodeID
  substitutions: Substitutions
}

interface Substitute {
  type: "SUBSTITUTE"
  parent: NodeID
  substitutions: Substitutions
}

export type ReductionStage = Apply | Consume | Unbind | Substitute

export interface TreeState {
  readonly root?: NodeID
  readonly nodes: Tree
  readonly reduction?: ReductionStage
}

export const initialTreeState: TreeState = { nodes: {} }
