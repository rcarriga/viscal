import { TreeAction, NORMAL_ORDER_REDUCTION } from "./types"

export function normalOrderReduce(expressionID: string): TreeAction {
  return { type: NORMAL_ORDER_REDUCTION, expressionID: expressionID }
}
