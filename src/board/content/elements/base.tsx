import { NodeEvents, NodeID } from "../../state"

export interface ExprProps {
  id: string
  children?: any
}
export interface RawExprProps {
  id: string
  nodeID: NodeID
  x: number
  y: number
  events: NodeEvents
  className?: string
  children?: any
}

export const useMoveTracker = () => {
  return {
    // onRest: (current: any) => {
    //   console.log(current)
    //   // if (current === prev) props.events.rest(props.id)
    // }
  }
}
