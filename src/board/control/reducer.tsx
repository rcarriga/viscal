/* eslint-disable jsx-a11y/anchor-is-valid */
import IconButton from "@material-ui/core/IconButton"
import FastForwardIcon from "@material-ui/icons/FastForward"
import FastRewindIcon from "@material-ui/icons/FastRewind"
import PauseIcon from "@material-ui/icons/PauseSharp"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"

import { reducers } from "board/calculus"
import { setReducer, useReducer, useDispatch, useMode, setMode } from "board/state"
import _ from "lodash"
import React from "react"

const ReducerControl = () => {
  const currentReducer = reducers[useReducer() || ""] || { name: "No Method" }
  const dis = useDispatch()
  const mode = useMode()
  return (
    <div>
      <div className="menu-label">Reduction</div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
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
        <div className="dropdown is-hoverable" style={{ width: "100%" }}>
          <div className="dropdown-trigger" style={{ width: "100%" }}>
            <button style={{ width: "100%" }} className="button has-text-dark">
              {currentReducer.name}
            </button>
          </div>
          <div className="dropdown-menu">
            <div className="dropdown-content">
              {_.map(reducers, (reducer, reducerID) => (
                <a
                  key={reducer.name}
                  style={{ height: "100%", width: "100%", textAlign: "center" }}
                  className="dropdown-item has-text-grey"
                  onClick={() => dis(setReducer(reducerID))}
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
