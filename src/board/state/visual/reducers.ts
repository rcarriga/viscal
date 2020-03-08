import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { NodeID } from "board/state/tree"
import {
  VisualState,
  initialVisualState,
  DimensionSetting,
  Layout,
  AnimationMode,
  AnimationSettings,
  AnimationSetting
} from "./types"

const visualSlice = createSlice({
  name: "visual",
  initialState: initialVisualState as VisualState,
  reducers: {
    setSelected: (state, action: PayloadAction<NodeID | undefined>) => {
      state.selected = action.payload
    },
    setHighlighted: (state, action: PayloadAction<NodeID | undefined>) => {
      state.highlighted = action.payload
    },
    setDimension: (state, action: PayloadAction<{ dimension: DimensionSetting; value: number }>) => {
      const { dimension, value } = action.payload
      state.dimensions[dimension] = value
    },
    setLayout: (state, action: PayloadAction<{ parameter: Layout; value: number }>) => {
      const { parameter, value } = action.payload
      state.treeLayout[parameter] = value
    },
    adjustLayout: (state, action: PayloadAction<{ parameter: Layout; value: number }>) => {
      const { parameter, value } = action.payload
      state.treeLayout[parameter] += value
    },
    setMode: (state, action: PayloadAction<AnimationMode>) => {
      state.animation.mode = action.payload
    },
    setAnimationSetting: <A extends AnimationSettings, K extends AnimationSetting>(
      state: VisualState,
      action: PayloadAction<{ setting: K; value: A[K] }>
    ) => {
      const { setting, value } = action.payload
      state.animation.settings[setting] = value
    },
    setAnimationEnabled: (state, action: PayloadAction<boolean>) => {
      state.animation.enabled = action.payload
    },
    updateDimensions: (state, action: PayloadAction<{ [dimension in DimensionSetting]: number }>) => {
      state.dimensions = { ...state.dimensions, ...action.payload }
    }
  }
})

export default visualSlice

export const {
  setSelected,
  setHighlighted,
  setDimension,
  setLayout,
  adjustLayout,
  setMode,
  setAnimationSetting,
  setAnimationEnabled,
  updateDimensions
} = visualSlice.actions
