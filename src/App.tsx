import TitleBar from "components/titlebar"
import React from "react"
import "./App.css"
import { Board } from "./board"

const App: React.FC = () => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <TitleBar />
      <Board />
    </div>
  )
}

export default App
