import { LambdaReducerID } from "board/state"
import { LambdaReducer } from "./base"
import Normal from "./normal"

export default {
  1: Normal
} as { [id in LambdaReducerID]: LambdaReducer }
