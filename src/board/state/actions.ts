import { TreeAction } from "./tree/actions"
import { ControlAction } from "./control/actions"

export type BoardAction = TreeAction | ControlAction
