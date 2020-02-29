import React from "react"

const TitleBar = (props: { children?: any }) => {
  return (
    <div className="hero">
      <div className="hero-body">
        <div className="container">
          <div className="title is-1 is-family-sans-serif">𝝺 Viscal</div>
          <div className="subtitle">A visual language to interpret the Lambda Calculus</div>
        </div>
      </div>
      {props.children}
    </div>
  )
}

export default TitleBar
