/* eslint-disable react/no-children-prop */
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
import {
  testTree,
  TreeNode,
  constructCoords,
  TreeState,
  APPLICATION,
  ABSTRACTION,
  VARIABLE
} from "./Tree"

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
  return <svg className="viewport" children={createExprs(drawProps)}></svg>
}

const createExprs = (drawProps: DrawProps) => {
  const x = constructCoords(testTree, {
    circleRadius: 30,
    heightMargin: 20,
    widthMargin: 30,
    strokeWidth: 2
  })
  console.log(x)
  return _.map(x.nodes, (node, nodeID) => createExpr(nodeID, node, drawProps))
}

const createExpr = (nodeID: string, node: TreeNode, drawProps: DrawProps) => {
  console.log(node)
  switch (node.expr.type) {
    case VARIABLE:
      return (
        <Var
          key={nodeID}
          id={nodeID}
          x={node.coord.x}
          y={node.coord.y}
          radius={drawProps.circleRadius}
        />
      )
    case ABSTRACTION:
      return (
        <Abs
          key={nodeID}
          id={nodeID}
          x={node.coord.x}
          y={node.coord.y}
          width={node.coord.w}
          radius={drawProps.circleRadius}
          height={node.coord.h}
          heightMargin={drawProps.heightMargin}
          widthMargin={drawProps.widthMargin}
          strokeWidth={drawProps.strokeWidth}
        />
      )
    case APPLICATION:
      return (
        <Appl
          key={nodeID}
          id={nodeID}
          x={node.coord.x}
          y={node.coord.y}
          radius={drawProps.circleRadius}
          width={node.coord.w}
          height={node.coord.h}
          heightMargin={drawProps.heightMargin}
          widthMargin={drawProps.widthMargin}
          strokeWidth={drawProps.strokeWidth}
        />
      )
  }
}

export default App
