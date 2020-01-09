import React from "react"
import styled from "styled-components"
import { BoardContent } from "./content"
import { BoardControl } from "./control"

export const Board = () => (
  <BoardContainer>
    <BoardContent />
    <BoardControl />
  </BoardContainer>
)

const BoardContainer = styled.div`
  min-width: 80vw;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
