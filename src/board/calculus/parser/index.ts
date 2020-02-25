import { F, C, Streams, TupleParser, VoidParser, SingleParser, Option } from "@masala/parser"
import { addVariable, addAbstraction, addApplication } from "board/state"

const parseTree = (addVar: typeof addVariable, addAbs: typeof addAbstraction, addAppl: typeof addApplication) => {}

type Var = { type: "VAR"; varName: string }
type Abs = { type: "ABS"; varName: string; child?: Expr }
type Appl = { type: "APPL"; left: Expr; right: Expr }
type Expr = Var | Abs | Appl

const expr = (): SingleParser<Expr> => {
  return nonApp()
    .rep()
    .map(res => {
      const exprs = res.array().reverse()
      return exprs.slice(1).reduce((right, left) => ({ type: "APPL", left, right }), exprs[0])
    })
}

const nonApp = (): SingleParser<Expr> => {
  return F.try(parens(F.lazy(expr)).single()).or(F.try(F.lazy(abstraction)).or(F.try(F.lazy(variable))))
}

const abstraction = (): SingleParser<Abs> => {
  return trim(
    C.char("\\")
      .drop()
      .then(varName().rep())
      .then(C.char(".").drop())
      .then(F.lazy(expr).opt())
      .map(parsed => {
        const parsedVals = parsed.array()
        const child: Option<Expr> = parsedVals.pop()
        const names: string[] = parsedVals
        const buildAbs = (expr: Expr | undefined, varName: string): Abs => ({ type: "ABS", varName, child: expr })
        return names
          .slice(0, names.length - 1)
          .reverse()
          .reduce(buildAbs, buildAbs(child.orElse(undefined), names[names.length - 1]))
      })
  ).single()
}

const variable = (): SingleParser<Var> => varName().map(res => ({ type: "VAR", varName: res }))

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
export default parse
