import { LambdaReducerID } from "board/state"
import Applicative from "./applicative"
import { LambdaReducer } from "./base"
import Normal from "./normal"

export * from "./base"

const reducers: { [id in LambdaReducerID]: LambdaReducer } = {
  normal: Normal,
  applicative: Applicative
} as const

export default reducers
