import React from "react"
import { Provider } from "react-redux"
import { classes, style } from "typestyle"
import { BoardContent } from "./content"
import { BoardControl } from "./control"
import store from "./state"

export const Board = () => (
  <Provider store={store}>
    <div
      className={classes(
        "columns",
        style({
          width: "100%",
          height: "90%"
        })
      )}
    >
      <div
        className={classes(
          "column",
          style({
            borderRight: "2px grey solid"
          })
        )}
      >
        <BoardContent />
      </div>
      <div className="column is-narrow">
        <BoardControl />
      </div>
    </div>
  </Provider>
)

export { BoardContent }
