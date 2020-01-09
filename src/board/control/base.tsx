import { connect } from "react-redux"
import { AppState } from "../../state"
import { setLayout, setDimension } from "../state"

const mapState = (state: AppState) => ({ state: state.board.visual })
const mapDispatch = {
  setLayout,
  setDimension
}

export type ControlProps = ReturnType<typeof mapState> & typeof mapDispatch
export const connectState = connect(mapState, mapDispatch)

export interface ControlsTheme {
  fg: string
  bg: string
}
