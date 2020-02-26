import Button from "@material-ui/core/Button"
import { parseExpression } from "board/calculus"
import { useDispatch, clearTree } from "board/state"
import React, { useState, useEffect } from "react"
import { ActionCreators } from "redux-undo"

const ExpressionControl = () => {
  const dis = useDispatch()
  const [active, setActive] = useState(false)
  const [input, setInput] = useState("")
  const [expr, setExpr] = useState("(\\a.a) (\\a b. a b) c")
  const toggle = () => setActive(!active)
  useEffect(() => {
    dis(clearTree())
    dis(ActionCreators.clearHistory())
    parseExpression(expr, dis)
  }, [dis, expr])
  return (
    <div>
      <Button variant="outlined" onClick={() => setActive(!active)}>
        𝝺 Change Expression
      </Button>
      <div>
        <div className={`modal ${active ? "is-active" : ""}`}>
          <div className="modal-background" onClick={toggle} />
          <div className="modal-content">
            <div className="card is-background-light">
              <div className="card-content">
                <input
                  className="input is-medium"
                  value={input}
                  onChange={e => setInput(e.currentTarget.value)}
                  type="text"
                  placeholder="Enter a lambda expression"
                />
                <Button
                  style={{ margin: "10px" }}
                  onClick={() => {
                    toggle()
                    setExpr(input)
                  }}
                  color="primary"
                  variant="contained"
                >
                  OK
                </Button>
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
