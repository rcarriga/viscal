import { TreeAction } from "./tree/actions"
import visualSlice from "./visual/reducers"

export type BoardAction = TreeAction | keyof typeof visualSlice.actions
