import { generateID } from "board/calculus/util"
import { useSelected, useDispatch, NodeID, createPrimitive, setSelected } from "board/state"
import React, { useState } from "react"

const PrimitveControl = () => {
  const selectedList = useSelected()
  const selected = selectedList.length === 1 ? selectedList[0] : ""
  const [modal, setModal] = useState(false)
  return (
    <div>
      <PrimitiveModal show={modal} nodeID={selected} onClose={() => setModal(false)} />
      <div className="menu-label">Primitives</div>
      <div className="" style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => selected && setModal(true)}
          className={`button ${selected ? "has-text-info" : "has-text-dark"} `}
          style={{ width: "100%" }}
        >
          {selected ? "Create" : "Select a Node"}
        </button>
      </div>
    </div>
  )
}

const PrimitiveModal = (props: { nodeID: NodeID; show: boolean; onClose: () => void }) => {
  const close = () => {
    setInput("")
    props.onClose()
  }
  const dis = useDispatch()
  const [input, setInput] = useState("")
  return (
    <div className={`modal ${props.show && "is-active"}`}>
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <div className="box">
          <div className="card-content">
            <input
              onChange={e => setInput(e.currentTarget.value)}
              value={input}
              className="input is-medium"
              style={{ marginBottom: 10 }}
              type="text"
              placeholder="Enter a name for the primitive"
            />
            <button
              className="button is-capitalized"
              onClick={() => {
                if (props.nodeID && input) {
                  dis(createPrimitive({ name: input, primID: generateID(), rootID: props.nodeID }))
                  dis(setSelected([]))
                }
                close()
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
      <button onClick={close} className="modal-close is-large" aria-label="close"></button>
    </div>
  )
}

export default PrimitveControl
