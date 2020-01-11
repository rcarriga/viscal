import { connect } from "react-redux"
import { BoardState, setLayout, setDimension } from "../state"

const mapState = (state: BoardState) => ({ state: state.visual })
const mapDispatch = {
  setLayout,
  setDimension
}

export type ControlProps = ReturnType<typeof mapState> & typeof mapDispatch
export const connectState = connect(mapState, mapDispatch)
