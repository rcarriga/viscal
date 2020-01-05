import { addVariable, addAbstraction, addApplication, setRoot } from "./state"
import { AppState } from "../state"
import { connect } from "react-redux"

const mapState = (state: AppState) => ({ state: state.board })
const mapDispatch = {
  setRoot: setRoot,
  addVar: addVariable,
  addAbs: addAbstraction,
  addApp: addApplication
}

export type BoardProps = ReturnType<typeof mapState> & typeof mapDispatch
export const connectState = connect(mapState, mapDispatch)
