import useComponentSize from "@rehooks/component-size"
import { motion } from "framer-motion"
import React, { useState, useRef } from "react"
import Graph from "./graph"
import Tooltip from "./tooltip"

const BoardContent = () => {
  const ref = useRef(null)
  const { width, height } = useComponentSize(ref)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [panning, setPanning] = useState(false)
  return (
    <div ref={ref} className="has-background-light" style={{ width: "100%", height: "100%" }}>
      <motion.svg
        id="board-content"
        pointerEvents="all"
        className=""
        viewBox={`${x - width / 10} ${y - height / 2} ${width} ${height}`}
        style={{
          width: "100%",
          height: "100%",
          cursor: panning ? "move" : "pointer"
        }}
        onPanStart={() => setPanning(true)}
        onPanEnd={() => setPanning(false)}
        onPan={(_e, info) => {
          setX(x - info.delta.x)
          setY(y - info.delta.y)
        }}
      >
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        <Graph />
        <Tooltip />
      </motion.svg>
    </div>
  )
}

export default BoardContent
