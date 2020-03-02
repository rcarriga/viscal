export type NodeID = string
export type RefID = string
export type VarName = string
export type VarIndex = number | undefined

export type NodeType = "NULL" | "VARIABLE" | "ABSTRACTION" | "APPLICATION"

interface BaseExpression {
  type: NodeType
  children: (tree: Tree) => NodeID[]
  directChildren: NodeID[]
}

interface NullExpression extends BaseExpression {
  type: "NULL"
}

export interface Variable extends BaseExpression {
  type: "VARIABLE"
  index: VarIndex
  name: VarName
  binder: (tree: TreeState) => NodeID | undefined
}

export interface Abstraction extends BaseExpression {
  type: "ABSTRACTION"
  child?: NodeID
  variableName: VarName
}

export interface Application extends BaseExpression {
  type: "APPLICATION"
  left?: NodeID
  right?: NodeID
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
  "FADE",
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

export type ExprConstant = string

export type ConstName = string | number

export type ExprConstants = { [constName in ConstName]: ExprConstant }

export interface TreeState {
  root: NodeID
  nodes: Tree
  reduction?: ReductionStage
  constants: ExprConstants
}

export const initialTreeState: TreeState = {
  nodes: {},
  root: "",
  constants: {
    PLUS: "λm.λn.λf.λx.m f (n f x)",
    MULT: "λm.λn.λf.m (n f)",
    SUCC: "λn.λf.λx.f (n f x)",
    POW: "λb.λe.e b",
    PRED: "λn.λf.λx.n (λg.λh.h (g f)) (λu.x) (λu.u)",
    SUB: "λm.λn.n PRED m",
    TRUE: "λx.λy.x",
    FALSE: "λx.λy.y",
    AND: "λp.λq.p q p",
    OR: "λp.λq.p p q",
    NOT: "λp.p FALSE TRUE",
    IFTHENELSE: "λp.λa.λb.p a b",
    ISZERO: "λn.n (λx.FALSE) TRUE",
    LEQ: "λm.λn.ISZERO (SUB m n)"
  }
}
