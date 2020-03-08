import { visibleChildren } from "board/state/tree/util"
import _ from "lodash"
import { createSelector } from "reselect"
import { NodeID, TreeState } from "./types"

type Parents = { [nodeID in NodeID]: NodeID }

const constructParents = (tree: TreeState, parents = {}): Parents => {
  const rootID = tree.root || ""
  const root = tree.nodes[rootID]
  if (root) {
    return _.reduce(
      visibleChildren(root, tree.nodes),
      (parents: Parents, nodeID: string) => {
        return constructParents({ ...tree, root: nodeID }, { ...parents, [nodeID]: rootID })
      },
      parents
    )
  } else return parents
}

/**
 * Retrieve the parents for nodes based on the given state.
 * @return {Parents} Parents object containing parent NodeIDs for all nodes from root.
 */
export const parentsSelector = createSelector((state: TreeState) => state, constructParents)
