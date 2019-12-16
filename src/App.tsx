import React from 'react';
import './App.css';
import {Motion, spring} from "react-motion"

class ExprProps {
  baseX: number = 0
  baseY: number = 0
}
class VariableProps extends ExprProps {
  fill: string = ""
  free: boolean = false
}

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Lambird</h1>
        <h3 className="App-subtitle">Graphical Lambda Calculus Evaluator</h3>
      </header>
      <div className="App-content">
        <svg className="viewport">
          <Variable fill="#550000" baseX={100} baseY={100} free={false}></Variable>
        </svg>
      </div>
    </div>
  );
}

function Variable(props: VariableProps) {
  return <Motion defaultStyle={{x: props.baseX, y: props.baseY}} style={{x: spring(300, {stiffness: 50}), y: spring(300, {stiffness: 50})}}>
    {(style) => (<circle cx={style.x} cy={style.y} r={50} fill={props.fill} ></circle>)
    }
  </Motion>
}
export default App;
