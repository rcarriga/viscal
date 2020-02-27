import { useSelected, useHighlighted, useCoord, useTree, Variable, Abstraction, Application } from "board/state"
import React from "react"

const Tooltip = () => {
  const selected = useSelected()
  const highlighted = useHighlighted()
  const nodeID = selected || highlighted
  const coord = useCoord(nodeID || "")
  const node = useTree()[nodeID || ""]
  if (!nodeID || !coord) return null
  const description = () => {
    switch (node.type) {
      case "VARIABLE":
        return <VarDescription node={node} />
      case "ABSTRACTION":
        return <AbsDescription node={node} />
      default:
        return null
    }
  }
  const width = 400
  return (
    <foreignObject x={coord.x + coord.w / 2 - width / 2} y={coord.y + 100} height={300} width={width}>
      <div className="card" style={{ border: "3px solid grey", borderRadius: 3 }}>
        <div className="card-content">{description()}</div>
      </div>
    </foreignObject>
  )
}

const VarDescription = ({ node }: { node: Variable }) => {
  return (
    <div className="">
      <DescriptionTitle name="Variable" />
      <DescriptionRow name={"Name"} value={node.name} />
    </div>
  )
}

const AbsDescription = ({ node }: { node: Abstraction }) => {
  return (
    <div className="">
      <DescriptionTitle name="Abstraction" />
      <DescriptionRow name={"Scoped Variable"} value={node.variableName} />
    </div>
  )
}

const DescriptionRow = ({ name, value }: { name: string; value: string }) => (
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
