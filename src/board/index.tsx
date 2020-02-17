import React from "react"
import { Provider } from "react-redux"
import { classes, style } from "typestyle"
import BoardContent from "./content"
import BoardControl from "./control"
import store from "./state"

export const Board = () => (
  <Provider store={store}>
    <div
      className={classes(
        style({
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          justifyContent: "flex-end"
        })
      )}
    >
      <div
        className={style({
          position: "absolute",
          margin: "20px"
        })}
      >
        <BoardControl />
      </div>
      <BoardContent />
    </div>
  </Provider>
)

export { BoardContent }
