import { Dispatcher, addVariable, addAbstraction, addApplication, NodeID, setRoot, ExprConstants } from "board/state"
import P, { Parser } from "parsimmon"
import { generateID } from "../util"

type Indices = { [name: string]: number }

type ParsedVar = { type: "VAR"; varName: string }
type ParsedAbs = { type: "ABS"; varName: string; child?: ParsedExpr }
type ParsedAppl = { type: "APPL"; left: ParsedExpr; right: ParsedExpr }
type ParsedExpr = ParsedVar | ParsedAbs | ParsedAppl

export const parseExpression = (
  expression: string,
  dis: Dispatcher,
  constants: ExprConstants
): P.Failure | undefined => {
  const parens = <T>(parser: Parser<T>): Parser<T> =>
    P.string("(")
      .then(trim(parser))
      .skip(P.string(")"))

  const trim = <T>(parser: Parser<T>): Parser<T> => P.optWhitespace.then(parser).skip(P.optWhitespace)

  const varName: Parser<string> = trim(P.regexp(/[a-z]+/))

  const constName: Parser<string> = trim(P.regexp(/[A-Z]+/))

  const expr = (): Parser<ParsedExpr> =>
    nonApp()
      .atLeast(1)
      .map(exprs => {
        return exprs.slice(1).reduce((left, right) => ({ type: "APPL", left, right }), exprs[0])
      })

  const nonApp = (): Parser<ParsedExpr> =>
    trim(P.alt(parens(P.lazy(expr)), P.lazy(abstraction), P.lazy(variable), P.lazy(constant)))

  const variable = (): Parser<ParsedVar> => varName.map(res => ({ type: "VAR", varName: res }))

  const abstraction = (): Parser<ParsedAbs> =>
    P.string("\\")
      .or(P.string("λ"))
      .then(
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

  const constant = (): Parser<ParsedExpr> =>
    trim(
      constName.or(
        P.regexp(/[0-9]+/).map(res => {
          const num = Number(res)
          let numText = "x"
          for (let index = 0; index < num; index++) {
            numText = `f (${numText})`
          }
          return `λ f x. ${numText}`
        })
      )
    ).map(res => {
      const parsed = expr().parse(constants[res] || res)
      return parsed.status
        ? parsed.value
        : ((P.makeFailure(parsed.index.offset, parsed.expected) as unknown) as ParsedExpr)
    })

  const res = expr().parse(expression)
  console.log(res)
  if (res.status) {
    const parsed = res.value
    if (!parsed) return
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
    fillState(parsed, {}, rootID)
    dis(setRoot(rootID))
  } else {
    return res
  }
}
