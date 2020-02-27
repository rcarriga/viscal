/* eslint-disable jsx-a11y/anchor-is-valid */
import IconButton from "@material-ui/core/IconButton"
import FastForwardIcon from "@material-ui/icons/FastForward"
import FastRewindIcon from "@material-ui/icons/FastRewind"
import PauseIcon from "@material-ui/icons/PauseSharp"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"

import { reducers } from "board/calculus"
import { useDispatch, useMode, setMode } from "board/state"
import React, { useState } from "react"

const ReducerControl = () => {
  const [currentReducer, setReducer] = useState(reducers.normal)
  const dis = useDispatch()
  const mode = useMode()
  return (
    <div>
      <div className="title is-5">Reduction</div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          marginBottom: "10px"
        }}
      >
        <IconButton onClick={() => dis(setMode("REVERSE"))}>
          <FastRewindIcon />
        </IconButton>
        {mode !== "STOP" ? (
          <IconButton onClick={() => dis(setMode("STOP"))}>
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => dis(setMode("PLAY"))}>
            <PlayArrowIcon />
          </IconButton>
        )}
        <IconButton onClick={() => dis(setMode("FORWARD"))}>
          <FastForwardIcon />
        </IconButton>
      </div>
      <div>
        <div className="has-text-dark" style={{ marginBottom: 5 }}>
          Method
        </div>
        <div className="dropdown is-hoverable" style={{ width: "100%" }}>
          <div className="dropdown-trigger" style={{ width: "100%" }}>
            <button style={{ width: "100%" }} className="button has-text-dark">
              {currentReducer.name}
            </button>
          </div>
          <div className="dropdown-menu">
            <div className="dropdown-content">
              {Object.values(reducers).map(reducer => (
                <a
                  key={reducer.name}
                  style={{ width: "100%", textAlign: "center" }}
                  className="dropdown-item has-text-grey"
                  onClick={() => setReducer(reducer)}
                >
                  {reducer.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReducerControl
