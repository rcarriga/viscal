import TitleBar from "components/titlebar"
import React from "react"
import "./App.css"
import { style } from "typestyle"
import { Board } from "./board"

const App: React.FC = () => {
  return (
    <div className={style({ height: "100%", width: "100%" })}>
      <TitleBar />
      <Board />
    </div>
  )
}

export default App
