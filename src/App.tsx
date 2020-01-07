import React from "react"
import { Provider } from "react-redux"
import "./App.css"
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
          <Board></Board>
        </div>
      </div>
    </Provider>
  )
}

export default App
