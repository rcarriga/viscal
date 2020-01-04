/* eslint-disable react/no-children-prop */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { Provider } from "react-redux"
import _ from "lodash"
import "./App.css"
import styled from "styled-components"
import { Motion, spring } from "react-motion"
import { Board } from "./board"
import { store } from "./state"

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Lambird</h1>
          <h3 className="App-subtitle">Graphical Lambda Calculus Evaluator</h3>
        </header>
        <div className="App-content">
          <Board />
        </div>
      </div>
    </Provider>
  )
}
// export const testTree: TreeState = {
//   root: "app1",
//   nodes: {
//     app1: application("abs1", "var1"),
//     var1: variable(-1, "a", "app1"),
//     abs1: abstraction("b", "abs2", "app1"),
//     abs2: abstraction("c", "var2", "abs1"),
//     var2: variable(0, "b", "abs1")
//   }
// }

export default App
