/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Coord } from "./state/coords/types"
import { DrawState } from "./state/draw/types"
import _ from "lodash"

// (\b.b) a
export const testTree: TreeState = {
  root: "app1",
  nodes: {
    app1: application("abs1", "var1"),
    var1: variable(-1, "a", "app1"),
    abs1: abstraction("b", "abs2", "app1"),
    abs2: abstraction("c", "var2", "abs1"),
    var2: variable(0, "b", "abs1")
  }
}
