/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import _ from "lodash"
import "./App.css"
// import State from "./State"
import styled from "styled-components"
import { Motion, spring } from "react-motion"
import { Var, Abs, Appl } from "./exprs"
import { DrawProps } from "./draw"

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Lambird</h1>
        <h3 className="App-subtitle">Graphical Lambda Calculus Evaluator</h3>
      </header>
      <div className="App-content">
        <Drawboard circleRadius={30} heightMargin={20} widthMargin={20} strokeWidth={2} />
      </div>
    </div>
  )
}

const Drawboard = (drawProps: DrawProps) => {
  return (
    <svg className="viewport">
      <Var id="myvar" x={250} y={200} drawProps={drawProps} />
      <Abs
        id="myabs"
        x={200}
        y={200}
        width={drawProps.circleRadius * 4 + drawProps.heightMargin * 2}
        drawProps={drawProps}
      />
      <Appl id="myapp" x={200} y={300} width={300} drawProps={drawProps} />
    </svg>
  )
}

export default App
