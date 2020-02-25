import Button from "@material-ui/core/Button"
import { useExpression, useDispatch, setExpression } from "board/state"
import React, { useState } from "react"

const ExpressionControl = () => {
  const dis = useDispatch()
  const [active, setActive] = useState(false)
  const [input, setInput] = useState(useExpression())
  const toggle = () => setActive(!active)
  return (
    <div>
      <Button variant="outlined" onClick={() => setActive(!active)}>
        𝝺 Change Expression
      </Button>
      <div className="thisisaclass">
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
                    dis(setExpression(input))
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
