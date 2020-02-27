import {
  NodeCoord,
  useSelected,
  NodeID,
  useHighlighted,
  useCoord,
  Variable,
  Abstraction,
  TreeNode,
  TreeState,
  NodeJoins,
  Tree,
  useJoins,
  useTree
} from "board/state"
import { reduceObj } from "board/util"
import React, { useState } from "react"
import { useSpring, animated, config } from "react-spring"

const Tooltip = () => {
  const selected = useSelected()
  const tree = useTree()
  const joins = useJoins()
  const highlighted = useHighlighted()
  const nodeID = selected || highlighted
  const coord = useCoord(nodeID || "")
  const node = useTree()[nodeID || ""]
  const style = useSpring({
    opacity: nodeID && coord ? 1 : 0,
    config: config.gentle
  })
  const description = () => {
    if (nodeID && node) {
      const text = stringifyTree(tree, nodeID, joins)
      switch (node.type) {
        case "VARIABLE":
          return <VarDescription node={node} text={text} />
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

const VarDescription = ({ node, text }: { node: Variable; text: string }) => {
  return (
    <div className="">
      <DescriptionTitle name="Variable" />
      <DescriptionRow name={"Name"} value={node.name} />
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

const stringifyTree = (tree: Tree, rootID: NodeID, joins: NodeJoins): string => {
  const furthestJoins = reduceObj(joins, {} as { [nodeID in NodeID]: NodeID }, (furthestJoins, join, nodeID) => {
    const furthest: NodeID = furthestJoins[join.jointTo]
    if (furthest && joins[furthest].distance > join.distance) return furthestJoins
    return { ...furthestJoins, [join.jointTo]: nodeID }
  })
  const joinNames = (tree: Tree, end: NodeID, start?: NodeID): NodeID[] => {
    if (!start) return []
    const node = tree[start || ""]
    switch (node.type) {
      case "ABSTRACTION":
        return [node.variableName, ...(start === end ? [] : joinNames(tree, end, node.child))]
      default:
        return []
    }
  }
  const root = tree[rootID]
  if (!root) return ""
  switch (root.type) {
    case "VARIABLE":
      return root.name
    case "ABSTRACTION": {
      const furthest = furthestJoins[rootID]
      const nextNodes = tree[furthest] ? tree[furthest].children(tree) : root.children(tree)
      const names = joinNames(tree, furthest, rootID)
      return `\\${names.join(" ")}. ${nextNodes.map(nextNode => stringifyTree(tree, nextNode, joins)).join(" ")}`
    }
    case "APPLICATION": {
      return root
        .children(tree)
        .map(nodeID => stringifyTree(tree, nodeID, joins))
        .join(" ")
    }
    default:
      return ""
  }
}
