import { F, C, Streams, TupleParser, SingleParser, Option } from "@masala/parser"
import { Dispatcher, addVariable, addAbstraction, addApplication, NodeID, setRoot } from "board/state"
import { generateID } from "../util"

type Indices = { [name: string]: number }

export const parseExpression = (expression: string, dis: Dispatcher) => {
  const expr = parse(expression).value
  if (!expr) return
  const incrementIndex = (indices: Indices) =>
    Object.keys(indices).reduce((newIndex, key) => ({ ...newIndex, [key]: indices[key] + 1 }), {})
  const fillState = (expr: ParsedExpr | undefined, indices: { [name: string]: number }, nextID: NodeID) => {
    if (!expr) return
    switch (expr.type) {
      case "VAR":
        dis(addVariable(nextID, indices[expr.varName], expr.varName))
        break
      case "ABS": {
        const childID = generateID()
        dis(addAbstraction(nextID, expr.varName, childID))
        fillState(expr.child, { ...incrementIndex(indices), [expr.varName]: 0 }, childID)
        break
      }
      case "APPL": {
        const leftID = generateID()
        const rightID = generateID()
        dis(addApplication(nextID, leftID, rightID))
        fillState(expr.left, indices, leftID)
        fillState(expr.right, indices, rightID)
        break
      }
      default:
    }
  }
  const rootID = generateID()
  fillState(expr, {}, rootID)
  dis(setRoot(rootID))
}

type ParsedVar = { type: "VAR"; varName: string }
type ParsedAbs = { type: "ABS"; varName: string; child?: ParsedExpr }
type ParsedAppl = { type: "APPL"; left: ParsedExpr; right: ParsedExpr }
type ParsedExpr = ParsedVar | ParsedAbs | ParsedAppl

const expr = (): SingleParser<ParsedExpr> => {
  return nonApp()
    .rep()
    .map(res => {
      const exprs = res.array()
      return exprs.slice(1).reduce((left, right) => ({ type: "APPL", left, right }), exprs[0])
    })
}

const nonApp = (): SingleParser<ParsedExpr> => {
  return F.try(parens(F.lazy(expr)).single()).or(F.try(F.lazy(abstraction)).or(F.try(F.lazy(variable))))
}

const abstraction = (): SingleParser<ParsedAbs> => {
  return trim(
    C.char("\\")
      .drop()
      .then(varName().rep())
      .then(C.char(".").drop())
      .then(F.lazy(expr).opt())
      .map(parsed => {
        const parsedVals = parsed.array()
        const child: Option<ParsedExpr> = parsedVals.pop()
        const names: string[] = parsedVals
        const buildAbs = (expr: ParsedExpr | undefined, varName: string): ParsedAbs => ({
          type: "ABS",
          varName,
          child: expr
        })
        return names
          .slice(0, names.length - 1)
          .reverse()
          .reduce(buildAbs, buildAbs(child.orElse(undefined), names[names.length - 1]))
      })
  ).single()
}

const variable = (): SingleParser<ParsedVar> => varName().map(res => ({ type: "VAR", varName: res }))

const varName = (): SingleParser<string> => {
  return trim(C.lowerCase().rep()).map(chars => chars.join())
}

const parens = <T>(parser: TupleParser<T> | SingleParser<T>): TupleParser<T> => {
  return trim(
    C.char("(")
      .drop()
      .then(trim(parser))
      .then(C.char(")").drop())
  )
}

const trim = <T>(parser: TupleParser<T> | SingleParser<T>): TupleParser<T> => {
  return whitespace()
    .then(parser)
    .then(whitespace())
}

const whitespace = () =>
  C.char(" ")
    .optrep()
    .drop()

const parse = (expression: string) => {
  const stream = Streams.ofString(expression)
  return expr().parse(stream)
}
