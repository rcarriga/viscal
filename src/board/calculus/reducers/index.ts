import { LambdaReducerID } from "board/state"
import { LambdaReducer } from "./base"
import Normal from "./normal"

export * from "./base"

const reducers: { [id in LambdaReducerID]: LambdaReducer } = {
  normal: Normal
} as const

export default reducers
