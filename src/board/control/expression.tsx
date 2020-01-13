import React from "react"
import styled from "styled-components"

interface ExpressionInputProps {
  value: string
  onChange: any
  placeHolder: string
}

const ExpressionInput = styled.input.attrs((props: ExpressionInputProps) => ({
  onChange: props.onChange,
  placeholder: props.placeHolder,
  type: "text"
}))`
  width: 90%;
`

interface ExpressionControlProps extends ExpressionInputProps {}

export const ExpressionControl = (props: ExpressionInputProps) => {
  return (
    <div>
      <p>Expression:</p>
      <ExpressionInput {...props}></ExpressionInput>
    </div>
  )
}
