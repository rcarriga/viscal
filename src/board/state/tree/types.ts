export type NodeID = string
export type RefID = string
export type VarName = string
export type VarIndex = number | undefined

export type NodeType = "NULL" | "VARIABLE" | "ABSTRACTION" | "APPLICATION"

interface BaseExpression {
  type: NodeType
  children: (tree: Tree) => NodeID[]
  directChildren: NodeID[]
  primitive?: PrimitiveID
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

export type ConstName = string

export type ExprConstants = { [constName in ConstName]: ExprConstant }

export type PrimitiveID = string

export type Primitive = {
  name: string
  rootID: string
}

export type Primitives = { [primID in PrimitiveID]: Primitive }

export interface TreeState {
  root: NodeID
  nodes: Tree
  primitives: Primitives
  reducer?: LambdaReducerID
  reduction?: ReductionStage
  constants: ExprConstants
}

export const initialTreeState: TreeState = {
  nodes: {},
  root: "",
  primitives: {},
  constants: {
    RECURSE: "λ f. (λ x. f (x x)) (λ x. f (x x))",
    PLUS: "λ a b f x.a f (b f x)",
    MULT: "λ a b f.a (b f)",
    SUCC: "λ b f x.f (b f x)",
    POW: "λ b e.e b",
    PRED: "λ b f x.b (λ c d.d (c f)) (λ e.x) (λ e.e)",
    SUb: "λ a b.b PRED a",
    TRUE: "λ x y.x",
    FALSE: "λ x y.y",
    AND: "λ p q.p q p",
    OR: "λ p q.p p q",
    NOT: "λ p.p FALSE TRUE",
    IFTHENELSE: "λ p a b.p a b",
    ISZERO: "λ b.b (λ x.FALSE) TRUE",
    LEQ: "λ a b.ISZERO (SUB a b)"
  }
}
