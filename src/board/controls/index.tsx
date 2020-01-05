import React from "react"
import { ThemeProvider } from "styled-components"
import { Slider } from "./slider"

export const BoardControls = () => {
  const theme = {
    bg: "#262626",
    fg: "#a9ff68"
  }
  return (
    <ThemeProvider theme={theme}>
      <Slider min={10} max={100} value={40}></Slider>
    </ThemeProvider>
  )
}

