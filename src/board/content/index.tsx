import useComponentSize from "@rehooks/component-size"
import React, { useState, useRef } from "react"
import { animated } from "react-spring"
import Graph from "./graph"
import Tooltip from "./tooltip"

const BoardContent = () => {
  const ref = useRef(null)
  const { width, height } = useComponentSize(ref)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [panning, setPanning] = useState(false)
  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <svg
        id="board-content"
        pointerEvents="all"
        className=""
        viewBox={`${x - width / 10} ${y - height / 2} ${width} ${height}`}
        style={{
          width: "100%",
          height: "100%"
        }}
        onMouseDown={() => setPanning(true)}
        onMouseUp={() => setPanning(false)}
        onMouseMove={e => {
          if (panning) {
            setX(x - e.movementX)
            setY(y - e.movementY)
          }
        }}
      >
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        <Graph />
        <Tooltip />
      </svg>
    </div>
  )
}

export default BoardContent
