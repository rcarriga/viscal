import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import FastForwardIcon from "@material-ui/icons/FastForward"
import FastRewindIcon from "@material-ui/icons/FastRewind"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"

import reducers from "board/calculus"
import { useDispatch, queueReduction, useTreeState, nextReductionStage } from "board/state"
import React, { useState } from "react"
import { style, classes } from "typestyle"

const ReducerControl = () => {
  const [currentReducer, setReducer] = useState(reducers.normal)
  const dis = useDispatch()
  const tree = useTreeState()
  return (
    <div>
      <div className="subtitle">Reduction</div>
      <div className={style({ display: "flex" })}>
        <strong className={style({ marginRight: "5px" })}>Method: </strong>
        <div className="dropdown is-hoverable">
          <div className="dropdown-trigger">
            <a className="has-text-dark">{currentReducer.name}</a>
          </div>
          <div className="dropdown-menu">
            <div className="dropdown-content">
              {Object.values(reducers).map(reducer => (
                <div key={reducer.name} className="dropdown-item">
                  <a className="has-text-grey" onClick={() => setReducer(reducer)}>
                    {reducer.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={style({
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          marginBottom: "10px"
        })}
      >
        <IconButton>
          <FastRewindIcon />
        </IconButton>
        <IconButton onClick={() => dis(queueReduction(currentReducer.reduce(tree)))}>
          <PlayArrowIcon />
        </IconButton>
        <IconButton onClick={() => dis(nextReductionStage())}>
          <FastForwardIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default ReducerControl
