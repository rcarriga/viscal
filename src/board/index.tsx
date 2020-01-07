import React from "react"
import { BoardProps, connectState } from "./base"
import { BoardContent } from "./content"
import { BoardControl } from "./control"
import styled from "styled-components"

export const Board = connectState((props: BoardProps) => {
  return (
    <BoardContainer>
      <BoardContent {...props} />
      <BoardControl />
    </BoardContainer>
  )
})

const BoardContainer = styled.div`
  min-width: 80vw;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
