import { parseExpression } from "board/calculus"
import { useDispatch, clearTree, useTextTree } from "board/state"
import React, { useState, useEffect } from "react"
import { ActionCreators } from "redux-undo"

const ExpressionControl = () => {
  const dis = useDispatch()
  const [active, setActive] = useState(false)
  const [expr, setExpr] = useState("(λm.λn.λf.λx.m f (n f x)) (λf x.f (f x)) (λf x.f (f (f x)))")
  const [input, setInput] = useState(expr)
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
        <TreeText medium onClick={() => setActive(!active)} style={{ cursor: "pointer", marginBottom: 20 }} />
      </div>
      <div>
        <div className={`modal ${active ? "is-active" : ""}`}>
          <div className="modal-background" onClick={toggle} />
          <div className="modal-content">
            <div className="box is-background-light">
              <div className="card-content">
                <div className="container" style={{ margin: 20 }}>
                  <div className="subtitle is-5">Current Form</div>
                  <TreeText />
                </div>
                <div style={{ width: "100%", marginTop: 20, paddingLeft: "20%", paddingRight: "20%" }}>
                  <div className="dropdown-divider"></div>
                </div>
                <div className="container" style={{ margin: 20 }}>
                  <div className="subtitle is-5">Input</div>
                  <input
                    className="input is-medium"
                    value={input}
                    onChange={e => setInput(e.currentTarget.value)}
                    type="text"
                    placeholder="Enter a lambda expression"
                  />
                </div>
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="button has-text-light has-background-info"
                    style={{ marginRight: 20 }}
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
          </div>
          <button className="modal-close is-large" onClick={toggle} aria-label="close"></button>
        </div>
      </div>
    </div>
  )
}

const TreeText = (props: any) => {
  const text = useTextTree()
  const [hover, setHover] = useState(false)
  return (
    <div
      {...props}
      className={`tag is-light is-info is-${props.medium ? "medium" : "large"} is-paddingless ${props.className}`}
      style={{ width: "100%", overflow: hover ? "auto" : "hidden", ...(props.style || {}) }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ textAlign: "center", width: "100%" }}>{text}</div>
    </div>
  )
}

export default ExpressionControl
