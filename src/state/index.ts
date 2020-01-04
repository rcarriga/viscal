import rootReducer from "./reducers"
import { createStore } from "redux"

import { State } from "./types"
export type AppState = State
export const store = createStore(rootReducer)
