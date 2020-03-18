import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import AnimationControl from "board/control/animation"
import PrimitveControl from "board/control/primitive"
import { motion } from "framer-motion"
import React, { useState } from "react"

import ExpressionControl from "./expression"
import ReducerControl from "./reducer"
import ScaleControl from "./scale"

const ControlPanel = () => {
  const [show, setShow] = useState(true)
  const [div, setDiv] = useState(null as HTMLDivElement | null)
  return (
    <div className="box" style={{ width: 250 }}>
      <div
        style={{
          cursor: "pointer"
        }}
        onClick={() => setShow(!show)}
      >
        <div className="subtitle" style={{ float: "left", margin: 0 }}>
          Controls
        </div>
        <div style={{ float: "right" }}>
          <motion.div
            animate={{
              display: "inline-block",
              transform: show ? "rotate(180deg)" : "rotate(0deg)"
            }}
          >
            <ArrowDropDownIcon />
          </motion.div>
        </div>
        <div style={{ background: "black", width: "100%", opacity: 0 }}>_</div>
      </div>
      <motion.div
        className="menu"
        transition={{ type: "spring", stiffness: 50 }}
        animate={{
          display: "block",
          padding: 5,
          maxHeight: show && div ? div.clientHeight + 10 : 0,
          overflow: "hidden",
          clear: "both",
          marginBottom: show ? 20 : 0
        }}
      >
        <motion.div ref={setDiv}>
          <ExpressionControl />
          <ScaleControl />
          <AnimationControl />
          <PrimitveControl />
        </motion.div>
      </motion.div>
      <ReducerControl />
    </div>
  )
}

export default ControlPanel
