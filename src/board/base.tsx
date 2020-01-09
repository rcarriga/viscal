import { connect } from "react-redux"
import { AppState } from "../state"
import {
  addVariable,
  addAbstraction,
  addApplication,
  setRoot,
  setSelected,
  setHighlighted,
  setEvent
} from "./state"

const mapState = (state: AppState) => ({ state: state.board })
const mapDispatch = {
  addAbs: addAbstraction,
  addApp: addApplication,
  addVar: addVariable,
  setRoot,
  setEvent,
  setHighlighted,
  setSelected
}

export type BoardProps = ReturnType<typeof mapState> & typeof mapDispatch
export const connectState = connect(mapState, mapDispatch)
