import { NodeID, TreeNode } from "../.."

export type CoordID = string

export interface NodeDimension {
  readonly h: number
  readonly w: number
}

export interface NodeCoord extends NodeDimension {
  readonly nodeID: NodeID
  readonly type: TreeNode["type"]
  readonly x: number
  readonly y: number
}

export type Coords = { [coordID in CoordID]: NodeCoord }
export type CoordOffset = { x?: number; y?: number }
export type CoordOffsets = { [coordID in NodeID]: CoordOffset }

export type NodeDimensions = { [nodeID in NodeID]: NodeDimension }
export type DimensionOffset = { w?: number; h?: number }
export type DimensionOffsets = { [nodeID in NodeID]: DimensionOffset }

export type NodeJoins = { [nodeID in NodeID]: { distance: number; jointTo: NodeID } }
