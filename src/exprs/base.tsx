import React from "react"

export interface ExprProps {
  id: string
  x: number
  y: number
  radius: number
  className?: string
}

interface VarProps extends ExprProps {}

interface AbsProps extends ExprProps {
  height: number
  width: number
  widthMargin: number
  heightMargin: number
  strokeWidth: number
}

interface AppProps extends AbsProps {}

const Var = (props: VarProps) => {
  return (
    <ellipse
      id={props.id}
      className={props.className}
      cx={props.x + props.radius}
      cy={props.y}
      rx={props.radius}
    />
  )
}

const Abs = (props: AbsProps) => {
  const circleTopPoint = props.y - props.radius
  const inputX = props.x + props.width + props.radius
  const outPath = `M${props.x + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`
  const inStart = `M${inputX},${circleTopPoint}`
  const inPath = `${inStart} a1,1 0 0,0 0,${props.radius * 2}`

  return (
    <g id={props.id}>
      <path className={props.className} strokeOpacity={0} d={outPath} />
      <path
        className={props.className}
        stroke="grey"
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
        d={`M${props.x + props.radius},${circleTopPoint + props.radius * 2} 
          l0,${props.height / 2 - props.radius} 
            l${props.width},0 l0,${-props.heightMargin} 
            ${inPath} 
            ${inStart} 
            l0,${-props.heightMargin} 
            l${-props.width},0 
            l0,${props.heightMargin}`}
        fillOpacity="0"
      />
    </g>
  )
}

const Appl = (props: AppProps) => {
  const circleTopPoint = props.y - props.radius
  const outPath = `M${props.x + props.radius},${circleTopPoint} a1,1 0 0,0 0,${props.radius * 2}`
  const height = (props.radius + props.heightMargin) * 2

  return (
    <g id={props.id}>
      <path className={props.className} strokeOpacity={0} d={outPath} />
      <path
        className={props.className}
        stroke="grey"
        strokeLinecap="round"
        strokeWidth={props.strokeWidth}
        d={`M${props.x + props.radius},${circleTopPoint + props.radius * 2}
          l0,${height / 2 - props.radius} 
          l${props.width},0 
          l0,${-height - props.radius}
          l${-props.width},0 l0,${props.heightMargin}`}
        fillOpacity="0"
      />
    </g>
  )
}

export { Var }
export { Abs }
export { Appl }
