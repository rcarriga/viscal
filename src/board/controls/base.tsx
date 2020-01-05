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
  setRoot,
  setRadius,
  setStrokeWidth,
  setWidthMargin,
  setHeightMargin,
  setStartX,
  setStartY
}
export const connectState = connect(mapState, mapDispatch)

export interface ControlsTheme {
  fg: string
  bg: string
}
