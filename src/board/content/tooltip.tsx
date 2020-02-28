import {
  useSelected,
  NodeID,
  useHighlighted,
  useCoord,
  Variable,
  Abstraction,
  NodeJoins,
  Tree,
  useJoins,
  useTree,
  useTextTree
} from "board/state"
import React from "react"
import { useSpring, animated, config } from "react-spring"

const Tooltip = () => {
  const selected = useSelected()
  const highlighted = useHighlighted()
  const nodeID = selected || highlighted || ""
  const text = useTextTree(nodeID)
  const coord = useCoord(nodeID)
  const node = useTree()[nodeID]
  const style = useSpring({
    opacity: nodeID && coord ? 1 : 0,
    config: config.gentle
  })
  const description = () => {
    if (nodeID && node) {
      switch (node.type) {
        case "VARIABLE":
          return <VarDescription node={node} />
        case "ABSTRACTION":
          return <AbsDescription node={node} text={text} />
        default:
      }
    }
    return null
  }
  const width = 400
  return coord ? (
    <animated.foreignObject
      style={style}
      x={coord.x + coord.w / 2 - width / 2}
      y={coord.y + 100}
      height={300}
      width={width}
    >
      <div className="card" style={{ border: "3px solid grey", borderRadius: 3 }}>
        <div className="card-content">{description()}</div>
      </div>
    </animated.foreignObject>
  ) : null
}

const VarDescription = ({ node }: { node: Variable }) => {
  return (
    <div className="">
      <DescriptionTitle name="Variable" />
      <DescriptionRow name={"Name"} value={node.name} />
      <DescriptionRow name={"DrBruijn Index"} value={node.index} />
    </div>
  )
}

const AbsDescription = ({ node, text }: { node: Abstraction; text: string }) => {
  return (
    <div className="">
      <DescriptionTitle name="Abstraction" />
      <DescriptionRow name={"Scoped Variable"} value={node.variableName} />
      <DescriptionRow name={"Text"} value={text} />
    </div>
  )
}

const DescriptionRow = ({ name, value }: { name: string; value: any }) => (
  <div className="">
    <div style={{ display: "flex" }}>
      <strong style={{ marginRight: 10 }}>{name}:</strong>
      <div className="">{value}</div>
    </div>
  </div>
)

const DescriptionTitle = ({ name }: { name: string }) => (
  <div className="subtitle">
    {name}
    <div className="dropdown-divider" />
  </div>
)

export default Tooltip
