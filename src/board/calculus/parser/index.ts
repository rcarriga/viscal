import {
  Dispatcher,
  addVariable,
  addAbstraction,
  addApplication,
  createPrimitive,
  NodeID,
  setRoot,
  ExprConstants,
  Primitives
} from "board/state"
import _ from "lodash"
import P, { Parser } from "parsimmon"
import { generateID } from "../util"

type Indices = { [name: string]: number }

type ParsedVar = { type: "VAR"; varName: string }
type ParsedAbs = { type: "ABS"; varName: string; child?: ParsedExpr }
type ParsedAppl = { type: "APPL"; left: ParsedExpr; right: ParsedExpr }
type ParsedConst = { type: "CONST"; name: string; expr: ParsedExpr }
type ParsedExpr = ParsedVar | ParsedAbs | ParsedAppl | ParsedConst

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

  const constant = (): Parser<ParsedConst> =>
    trim(
      constName
        .map(name => ({ name, exprStr: constants[name] }))
        .or(
          P.regexp(/[0-9]+/).map(res => {
            const num = Number(res)
            let numText = "x"
            for (let index = 0; index < num; index++) {
              numText = `f (${numText})`
            }
            return { name: res, exprStr: `λ f x. ${numText}` }
          })
        )
    ).map(res => {
      const parsed = expr().parse(res.exprStr)
      return parsed.status
        ? { type: "CONST", name: res.name, expr: parsed.value }
        : ((P.makeFailure(parsed.index.offset, parsed.expected) as unknown) as ParsedConst)
    })

  const res = expr().parse(expression)
  if (res.status) {
    const parsed = res.value
    if (!parsed) return
    const incrementIndex = (indices: Indices) => _.mapValues(indices, index => index + 1)
    const fillState = (
      expr: ParsedExpr | undefined,
      indices: { [name: string]: number },
      nextID: NodeID,
      abstractions: NodeID[] = [],
      primitives: Primitives = {}
    ): Primitives => {
      if (!expr) return primitives
      switch (expr.type) {
        case "CONST": {
          const primID = generateID()
          return fillState(expr.expr, indices, nextID, abstractions, {
            ...primitives,
            [primID]: { rootID: nextID, name: expr.name }
          })
        }
        case "VAR":
          dis(addVariable({ nodeID: nextID, binder: abstractions[indices[expr.varName]], name: expr.varName }))
          return primitives
        case "ABS": {
          const childID = generateID()
          dis(addAbstraction({ nodeID: nextID, variableName: expr.varName, child: childID }))
          return fillState(
            expr.child,
            { ...incrementIndex(indices), [expr.varName]: 0 },
            childID,
            [nextID, ...abstractions],
            primitives
          )
        }
        case "APPL": {
          const leftID = generateID()
          const rightID = generateID()
          dis(addApplication({ nodeID: nextID, left: leftID, right: rightID }))
          const leftPrims = fillState(expr.left, indices, leftID, abstractions, primitives)
          return fillState(expr.right, indices, rightID, abstractions, leftPrims)
        }
        default:
          return primitives
      }
    }
    const rootID = generateID()
    const prims = fillState(parsed, {}, rootID)
    _.forEach(prims, (prim, primID) => dis(createPrimitive({ name: prim.name, primID, rootID: prim.rootID })))
    dis(setRoot(rootID))
  } else {
    return res
  }
}
