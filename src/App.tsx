import TitleBar from "components/titlebar"
import React from "react"
import "./App.css"
import { Board } from "./board"

const App: React.FC = () => {
  return (
    <div style={{ overflow: "hidden", width: "100vw", height: "100vh" }}>
      <TitleBar />
      <Board />
    </div>
  )
}

export default App
