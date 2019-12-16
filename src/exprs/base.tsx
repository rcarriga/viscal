export enum ExprType {
  Var,
  Abs,
  Appl
}

interface ExprTree {
  eid: number
  exprType: ExprType
  inner: Array<ExprTree>
}

const creatNode = (eid: number, type: ExprType, inner: Array<ExprTree>): ExprTree => ({
  eid: eid,
  exprType: type,
  inner: inner
})

export const Var = (eid: number) => creatNode(eid, ExprType.Var, [])
export const Abs = (eid: number, varId: number, inner: ExprTree) => creatNode(eid, ExprType.Abs, [Var(varId), inner])
export const Appl = (eid: number, left: ExprTree, right: ExprTree) => creatNode(eid, ExprType.Appl, [left, right])

const tree = Appl(1,
  Abs(2,
    3, Var(3)),
  Var(4))

export interface ExprProps {
  x: number
  y: number
  width: number
  height: number
  id: number
  label: string
  inner: {
    [id: number]: {
      props: ExprProps,
      construct: (props: ExprProps) => Element
    }
  }
}

