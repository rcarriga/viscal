import {
  useSelected,
  useHighlighted,
  useCoord,
  Variable,
  setSelected,
  Abstraction,
  useTree,
  useTextTree,
  NodeID,
  useDispatch,
  destructurePrimitive,
  usePrimitives,
  TreeNode,
  setRoot,
  useRoot
} from "board/state"
import React from "react"
import { useSpring, animated, config } from "react-spring"

const Tooltip = () => {
  const dis = useDispatch()
  const selected = useSelected()
  const highlighted = useHighlighted()
  const nodeID = selected.length === 1 ? selected[0] : highlighted[0] || ""
  const text = useTextTree(nodeID)
  const coord = useCoord(nodeID)
  const node = useTree()[nodeID]
  const style = useSpring({
    opacity: nodeID && coord ? 1 : 0,
    config: config.gentle,
    cursor: "default"
  })
  const deleteStyle = useSpring({
    float: "right",
    opacity: selected.length ? 1 : 0
  })
  const description = () => {
    if (nodeID && node) {
      return (
        <div>
          {(() => {
            switch (node.type) {
              case "VARIABLE":
                return <VarDescription nodeID={nodeID} node={node} />
              case "ABSTRACTION":
                return <AbsDescription nodeID={nodeID} node={node} text={text} />
              case "APPLICATION":
                return <ApplDescription nodeID={nodeID} text={text} />
              default:
            }
          })()}
          <div className="dropdown-divider" />
          <div className="columns">
            <RemovePrimitive node={node} />
            <ChangeRoot nodeID={nodeID} />
          </div>
        </div>
      )
    }
    return null
  }
  const width = coord ? 400 : 0
  const height = coord ? 300 : 0
  return (
    <animated.foreignObject
      style={style}
      x={coord ? coord.x + coord.w / 2 - width / 2 : 0}
      y={coord ? coord.y + 100 : 0}
      height={height}
      width={width}
    >
      <div className="card" style={{ border: "3px solid grey", borderRadius: 3 }}>
        <div className="card-content">
          <animated.button className="delete" onClick={() => dis(setSelected([]))} style={deleteStyle as any} />
          {description()}
        </div>
      </div>
    </animated.foreignObject>
  )
}

const VarDescription = ({ node, nodeID }: { node: Variable; nodeID: NodeID }) => {
  return (
    <div className="">
      <DescriptionTitle name="Variable" />
      <DescriptionRow name={"Name"} value={node.name} />
    </div>
  )
}

const AbsDescription = ({ node, text, nodeID }: { node: Abstraction; nodeID: NodeID; text: string }) => {
  return (
    <div className="">
      <DescriptionTitle name="Abstraction" />
      <DescriptionRow name={"Scoped Variable"} value={node.variableName} />
      <DescriptionRow name={"Text"} value={text} />
    </div>
  )
}

const ApplDescription = ({ text, nodeID }: { text: string; nodeID: NodeID }) => {
  return (
    <div className="">
      <DescriptionTitle name="Application" />
      <DescriptionRow name={"Text"} value={text} />
    </div>
  )
}

const DescriptionRow = ({ name, value }: { name: string; value: any }) =>
  value !== undefined ? (
    <div className="">
      <div style={{ display: "flex" }}>
        <strong style={{ marginRight: 10 }}>{name}:</strong>
        <div className="">{value}</div>
      </div>
    </div>
  ) : null

const DescriptionTitle = ({ name }: { name: string }) => (
  <div className="subtitle">
    {name}
    <div className="dropdown-divider" />
  </div>
)

const RemovePrimitive = ({ node }: { node: TreeNode }) => {
  const dis = useDispatch()
  const primID = node.primitives[node.primitives.length - 1]
  const primitive = usePrimitives()[primID]

  return primitive ? (
    <div className="column">
      <div className="button" onClick={() => dis(destructurePrimitive(primID))}>
        Destructure Primitive
      </div>
    </div>
  ) : null
}

const ChangeRoot = ({ nodeID }: { nodeID: NodeID }) => {
  const dis = useDispatch()
  const root = useRoot()
  return root !== nodeID ? (
    <div className="column">
      <div
        className="button"
        onClick={() => {
          dis(setSelected([]))
          dis(setRoot(nodeID))
        }}
      >
        Focus
      </div>
    </div>
  ) : null
}

export default Tooltip
