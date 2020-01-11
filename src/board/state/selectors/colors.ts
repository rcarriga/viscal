import _ from "lodash"
import randomcolor from "randomcolor"
import { createSelector } from "reselect"
import { BoardState, NodeID, TreeNode, TreeState, Color } from ".."

const constructColors = (tree: TreeState): VarColors => {
  return _.reduce(
    tree.nodes,
    (colors, node, nodeID) => ({
      ...colors,
      ...createColor(nodeID, node)
    }),
    {}
  )
}

const createColor = (nodeID: NodeID, node: TreeNode): VarColors => {
  if (node.type === "ABSTRACTION")
    return { [nodeID]: randomcolor({ seed: nodeID, luminosity: "bright" }) }
  else return {}
}

export type VarColors = { [bindingID in NodeID]: Color }
export const colorsSelector = createSelector((state: BoardState) => state.tree, constructColors)
