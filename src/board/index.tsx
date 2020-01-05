import React from "react"
import { BoardProps, connectState } from "./base"
import { BoardContent } from "./content"

export const Board = connectState((props: BoardProps) => {
  return (
    <div className="board">
      <BoardContent {...props} />

      <button>Click me</button>
    </div>
  )
})
