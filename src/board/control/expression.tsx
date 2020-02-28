import { parseExpression } from "board/calculus"
import { useDispatch, clearTree, useTextTree } from "board/state"
import React, { useState, useEffect } from "react"
import { ActionCreators } from "redux-undo"

const ExpressionControl = () => {
  const dis = useDispatch()
  const [active, setActive] = useState(false)
  const [expr, setExpr] = useState("(\\a b c. a (b c)) (\\a.a) b")
  const [input, setInput] = useState(expr)
  const text = useTextTree()
  const toggle = () => setActive(!active)
  useEffect(() => {
    dis(clearTree())
    dis(ActionCreators.clearHistory())
    parseExpression(expr, dis)
  }, [dis, expr])
  return (
    <div>
      <div className="menu-label">Expression</div>
      <div>
        <div className="tag is-light is-info is-medium" style={{ marginBottom: 20, width: "100%" }}>
          {text.length > 30 ? `${text.substr(0, 30)}...` : text}
        </div>
      </div>
      <button className="button" style={{ width: "100%" }} onClick={() => setActive(!active)}>
        𝝺 Change
      </button>
      <div>
        <div className={`modal ${active ? "is-active" : ""}`}>
          <div className="modal-background" onClick={toggle} />
          <div className="modal-content">
            <div className="card is-background-light">
              <div className="card-content">
                <div className="subtitle "></div>
                <input
                  className="input is-medium"
                  value={input}
                  onChange={e => setInput(e.currentTarget.value)}
                  type="text"
                  placeholder="Enter a lambda expression"
                />
                <button
                  className="button is-primary"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    toggle()
                    setExpr(input)
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
          <button className="modal-close is-large" onClick={toggle} aria-label="close"></button>
        </div>
      </div>
    </div>
  )
}

export default ExpressionControl
