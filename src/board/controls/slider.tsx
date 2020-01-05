import { ControlsTheme } from "./base"
import styled from "styled-components"

interface SliderProps {
  min: number
  max: number
  value: number
  theme: ControlsTheme
}

export const Slider = styled.input.attrs((props: SliderProps) => {
  return { type: "range", min: props.min, max: props.max, value: props.value }
})`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 10px;
  background: ${props => props.theme.bg};
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &::-webkit-slider-thumb,
  &::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25npx;
    height: 15px;
    background: ${props => props.theme.fg};
    cursor: pointer;
  }
`
