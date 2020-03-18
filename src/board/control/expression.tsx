import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import CancelIcon from "@material-ui/icons/Cancel"
import HelpIcon from "@material-ui/icons/Help"
import { parseExpression } from "board/calculus"
import { useDispatch, clearTree, useTextTree, useConstants, useOriginalRoot, useRoot, resetRoot } from "board/state"
import _ from "lodash"
import React, { useState, useEffect } from "react"
import { useSpring, animated } from "react-spring"
import { ActionCreators } from "redux-undo"

const ExpressionControl = () => {
  const dis = useDispatch()
  const [active, setActive] = useState(false)
  const [expr, setExpr] = useState("PLUS 1 2")
  const [input, setInput] = useState(expr)
  const toggle = () => setActive(!active)
  const constants = useConstants()
  const root = useOriginalRoot()
  const focused = useRoot()
  useEffect(() => {
    dis(clearTree())
    dis(ActionCreators.clearHistory())
    parseExpression(expr, dis, constants)
  }, [constants, dis, expr])
  return (
    <div>
      <div className="menu-label">Expression</div>
      <div style={{ marginBottom: 20 }}>
        <TreeText medium={"true"} onClick={() => setActive(!active)} style={{ cursor: "pointer" }} />
        <div
          className={`button has-text-${root !== focused ? "link" : "grey"}`}
          title={root !== focused ? "Reset focus" : "Can't reset focus"}
          style={{ width: "100%", marginTop: 10 }}
          onClick={() => dis(resetRoot())}
        >
          {root !== focused ? "Focused" : "Full View"}
        </div>
      </div>
      <div>
        <div className={`modal ${active ? "is-active" : ""}`}>
          <div className="modal-background" onClick={toggle} />
          <div className="modal-content">
            <div className="box is-background-light">
              <div className="card-content">
                <div className="container" style={{ margin: 20 }}>
                  <Constants />
                  <Divider />
                  <div className="subtitle is-5">Current Form</div>
                  <TreeText />
                  <Divider />
                  <Input value={input} onChange={e => setInput(e.currentTarget.value)} />
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
                    CHANGE
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

const Constants = () => {
  const constants = useConstants()
  const [active, setActive] = useState(false)
  const table = useSpring({ overflow: "auto", maxHeight: active ? 300 : 0 })
  const arrow = useSpring({
    display: "inline-block",
    transform: active ? "rotate(180deg)" : "rotate(0deg)"
  })
  return (
    <div>
      <div style={{ display: "flex", cursor: "pointer" }} onClick={() => setActive(!active)}>
        <div style={{ flexGrow: 7 }} className="subtitle is-5">
          Built-in Functions
        </div>
        <div style={{ flexGrow: 1 }}>
          <animated.div style={arrow}>
            <ArrowDropDownIcon fontSize="large" />
          </animated.div>
        </div>
      </div>
      <animated.div className="table-container" style={table}>
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead className="thead">
            <tr className="tr">
              <th className="th">Name</th>
              <th className="th">Text</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {_.map(constants, (text, name) => (
              <tr key={name} className="tr">
                <td className="td">{name}</td>
                <td className="td">{text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </animated.div>
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

const Divider = () => (
  <div style={{ width: "100%", margin: 10, paddingLeft: "20%", paddingRight: "20%" }}>
    <div className="dropdown-divider"></div>
  </div>
)

const Input = (props: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const [help, setHelp] = useState(false)
  const helpIcon = { cursor: "pointer", position: "absolute" } as const
  const helpMessage = useSpring({ overflowY: "auto", maxHeight: help ? 300 : 0, config: { clamp: true } })
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div className="subtitle is-5">Input</div>
        <div style={{ marginLeft: 10 }}>
          {!help ? (
            <animated.div onClick={() => setHelp(!help)} style={helpIcon}>
              <HelpIcon />
            </animated.div>
          ) : (
            <animated.div onClick={() => setHelp(!help)} style={helpIcon}>
              <CancelIcon />
            </animated.div>
          )}
        </div>
      </div>
      <Help style={helpMessage} />
      <input className="input is-medium" {...props} type="text" placeholder="Enter a lambda expression" />
    </div>
  )
}

const Help = (props: { style: React.CSSProperties }) => {
  return (
    <animated.div className="message is-info" style={props.style}>
      <div className="message-header">
        <p>Writing Expressions</p>
      </div>
      <div className="message-body">
        {
          'Expressions can be input as text. Examples of these can be seen in the built-in functions. Abstractions are \
        written with "λ" or "\\", followed by a list of lower-case variable names separated by spaces and finally \
        terminated by ".". Numbers can be entered as digits. Built-ins are used by using the upper-case name.'
        }
      </div>
    </animated.div>
  )
}

export default ExpressionControl
