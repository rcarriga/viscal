import TitleBar from "components/titleBar"
import React from "react"
import "./App.css"
import { classes, style } from "typestyle"
import { Board } from "./board"

const App: React.FC = () => {
  return (
    <div className={style({ height: "100%", width: "100%" })}>
      <TitleBar />
      <div
        className={classes(
          "has-background-light",
          style({
            width: "100%",
            height: "100%"
          })
        )}
      >
        <Board />
      </div>
    </div>
  )
}

export default App
