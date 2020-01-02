import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import rootReducer from "./reducers"
// import { State } from "./types"

export const store = createStore(rootReducer, applyMiddleware(thunk))

// export function addChild(parentID: string, childID: string) {
//   return (dispatch: any, getState: () => State) => {
//     const child = getState().tree.nodes[childID]
//     const parent = getState().tree.nodes[parentID]
//   }
// }
// const TestTree = {
//   app1: { type: NodeType.Application, children: ["var1", "abs1"] },
//   var1: { type: NodeType.Variable, parent: "app1" },
//   abs1: { type: NodeType.Abstraction, parent: "app1", children: [] }
// }

// export interface Store {
//   coords: Coordinates
//   drawProps: DrawProps
//   tree: Tree
// }

// const defaultStore: Store = {
//   coords: {},
//   drawProps: { circleRadius: 30, heightMargin: 20, widthMargin: 20, strokeWidth: 2 },
//   tree: {}
// }

// const addChildReducer = (state: Store, action: AddChildAction) => {
//   const node: Coord = state[action.parentID]
//   if (node) {
//     node.h += action.childHeight + 2 *
//   }
//   return state
// }
