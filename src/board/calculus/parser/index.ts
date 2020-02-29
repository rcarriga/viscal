import { Dispatcher, addVariable, addAbstraction, addApplication, NodeID, setRoot } from "board/state"
import P, { Parser } from "parsimmon"
import { generateID } from "../util"

type Indices = { [name: string]: number }

export const parseExpression = (expression: string, dis: Dispatcher) => {
  const expr = parse(expression)
  if (!expr) return
  console.log(expr)
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

const parens = <T>(parser: Parser<T>): Parser<T> =>
  P.string("(")
    .then(trim(parser))
    .skip(P.string(")"))

const trim = <T>(parser: Parser<T>): Parser<T> => P.optWhitespace.then(parser).skip(P.optWhitespace)

const varName: Parser<string> = trim(P.regexp(/[a-z]+/))

const expr = (): Parser<ParsedExpr> =>
  nonApp()
    .atLeast(1)
    .map(exprs => {
      return exprs.slice(1).reduce((left, right) => ({ type: "APPL", left, right }), exprs[0])
    })

const nonApp = (): Parser<ParsedExpr> => trim(P.alt(parens(P.lazy(expr)), P.lazy(abstraction), P.lazy(variable)))

const variable = (): Parser<ParsedVar> => varName.map(res => ({ type: "VAR", varName: res }))

const abstraction = (): Parser<ParsedAbs> =>
  P.string("\\").then(
    P.seqMap(varName.atLeast(1), P.string("."), P.lazy(expr), (names: string[], _: string, child: ParsedExpr) => {
      const buildAbs = (expr: ParsedExpr | undefined, varName: string): ParsedAbs => ({
        type: "ABS",
        varName,
        child: expr
      })
      return names
        .slice(0, names.length - 1)
        .reverse()
        .reduce(buildAbs, buildAbs(child, names[names.length - 1]))
    })
  )

const parse = (expression: string) => {
  return expr().tryParse(expression)
}
