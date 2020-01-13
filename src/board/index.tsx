import { ThemeProvider, useTheme, CssBaseline } from "@material-ui/core"
import React from "react"
import { Provider } from "react-redux"
import styled from "styled-components"
import { BoardContent } from "./content"
import { BoardControl } from "./control"
import store from "./state"

export const Board = () => (
  <Provider store={store}>
    <ThemeProvider theme={useTheme()}>
      <CssBaseline>
        <BoardContainer>
          <BoardControl />
          <BoardContent />
        </BoardContainer>
      </CssBaseline>
    </ThemeProvider>
  </Provider>
)

export { BoardContent }

const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`
