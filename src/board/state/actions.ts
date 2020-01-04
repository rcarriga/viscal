import { TreeAction } from "./tree/actions"
import { DrawAction } from "./draw/actions"

export type BoardAction = TreeAction | DrawAction
