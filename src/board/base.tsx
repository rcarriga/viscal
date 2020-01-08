import { addVariable, addAbstraction, addApplication, setRoot } from "./state"
import { AppState } from "../state"
import { connect } from "react-redux"

const mapState = (state: AppState) => ({ state: state.board }),
  mapDispatch = {
    addAbs: addAbstraction,
    addApp: addApplication,
    addVar: addVariable,
    setRoot: setRoot
  }

export type BoardProps = ReturnType<typeof mapState> & typeof mapDispatch
export const connectState = connect(mapState, mapDispatch)
