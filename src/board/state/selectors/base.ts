import { useSelector } from "react-redux"
import { BoardState } from ".."

export const useBoard = () => useSelector((state: BoardState) => state)
