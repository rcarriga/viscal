import { connect } from "react-redux"
import { AppState } from "../../state"
import {
  setRoot,
  setRadius,
  setStrokeWidth,
  setWidthMargin,
  setHeightMargin,
  setStartX,
  setStartY
} from "../state"

const mapState = (state: AppState) => ({ state: state.board.control })
const mapDispatch = {
  setHeightMargin,
  setRadius,
  setRoot,
  setStartX,
  setStartY,
  setStrokeWidth,
  setWidthMargin
}

export type ControlProps = ReturnType<typeof mapState> & typeof mapDispatch
export const connectState = connect(mapState, mapDispatch)

export interface ControlsTheme {
  fg: string
  bg: string
}
