import { BoardState, Tree, NodeID, NodeJoins, joinsSelector } from "board/state"
import _ from "lodash"
import { createSelector } from "reselect"

const stringifyTree = (tree: Tree, rootID: NodeID, joins: NodeJoins): string => {
  const furthestJoins = _.reduce(
    joins,
    (furthestJoins, join, nodeID) => {
      const furthest: NodeID = furthestJoins[join.jointTo]
      if (furthest && joins[furthest].distance > join.distance) return furthestJoins
      return { ...furthestJoins, [join.jointTo]: nodeID }
    },
    {} as { [nodeID in NodeID]: NodeID }
  )
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
      const furthest = furthestJoins[rootID] || (joins[rootID] ? furthestJoins[joins[rootID].jointTo] : "")
      const nextNodes = tree[furthest] ? tree[furthest].children(tree) : root.children(tree)
      const names = joinNames(tree, furthest, rootID)
      return `(λ ${names.join(" ")}. ${nextNodes.map(nextNode => stringifyTree(tree, nextNode, joins)).join(" ")})`
    }
    case "APPLICATION": {
      return `(${root
        .children(tree)
        .map(nodeID => stringifyTree(tree, nodeID, joins))
        .join(" ")})`
    }
    default:
      return ""
  }
}

export const textTreeSelector = createSelector(
  (state: BoardState) => state.tree.present.nodes,
  (state: BoardState) => joinsSelector(state),
  (tree, joins) => (rootID: NodeID) => stringifyTree(tree, rootID, joins)
)
