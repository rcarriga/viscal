import { NodeID } from "board/state"

export const generateID = (): NodeID => {
  return "_" + (Number(String(Math.random()).slice(5)) + Date.now() + Math.round(performance.now())).toString(36)
}
