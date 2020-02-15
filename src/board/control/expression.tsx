import React from "react"

interface ExpressionInputProps {
  value: string
  onChange: any
  placeHolder: string
}

export const ExpressionControl = (_: ExpressionInputProps) => {
  return (
    <div className="field">
      <div className="control">
        <input className="input is-link" type="text" placeholder="Enter Lamba Expression" />
      </div>
    </div>
  )
}
