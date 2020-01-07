import { TreeAction } from "./tree/actions"
import { ControlAction } from "./control/actions"
import { VisualAction } from "./visual/actions"

export type BoardAction = TreeAction | ControlAction | VisualAction
