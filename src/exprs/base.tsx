import React from "react"
import { DrawProps } from "../draw"

export interface ExprProps {
  id: string
  x: number
  y: number
  drawProps: DrawProps
  className?: string
}

interface VarProps extends ExprProps {}

interface AbsProps extends ExprProps {
  width: number
}

interface AppProps extends ExprProps {
  width: number
}

const Var = ({ id, x, y, drawProps, className }: VarProps) => {
  return <ellipse id={id} className={className} cx={x + drawProps.circleRadius} cy={y} rx={drawProps.circleRadius} />
}

const Abs = ({ id, x, y, width, drawProps, className }: AbsProps) => {
  const circleTopPoint = y - drawProps.circleRadius
  const inputX = x + width + drawProps.circleRadius
  const outPath = `M${x + drawProps.circleRadius},${circleTopPoint} a1,1 0 0,0 0,${drawProps.circleRadius * 2}`
  const inStart = `M${inputX},${circleTopPoint}`
  const inPath = `${inStart} a1,1 0 0,0 0,${drawProps.circleRadius * 2}`

  return (
    <g id={id}>
      <path className={className} strokeOpacity={0} d={outPath} />
      <path
        className={className}
        stroke="grey"
        strokeLinecap="round"
        strokeWidth={drawProps.strokeWidth}
        d={`M${x + drawProps.circleRadius},${circleTopPoint + drawProps.circleRadius * 2} 
            l0,${drawProps.heightMargin} 
            l${width},0 l0,${-drawProps.heightMargin} 
            ${inPath} 
            ${inStart} 
            l0,${-drawProps.heightMargin} 
            l${-width},0 
            l0,${drawProps.heightMargin}`}
        fillOpacity="0"
      />
    </g>
  )
}

const Appl = ({ id, x, y, width, drawProps, className }: AppProps) => {
  const circleTopPoint = y - drawProps.circleRadius
  const outPath = `M${x + drawProps.circleRadius},${circleTopPoint} a1,1 0 0,0 0,${drawProps.circleRadius * 2}`
  const height = (drawProps.circleRadius + drawProps.heightMargin) * 2

  return (
    <g id={id}>
      <path className={className} strokeOpacity={0} d={outPath} />
      <path
        className={className}
        stroke="grey"
        strokeLinecap="round"
        strokeWidth={drawProps.strokeWidth}
        d={`M${x + drawProps.circleRadius},${circleTopPoint + drawProps.circleRadius * 2} 
          l0,${drawProps.heightMargin} 
          l${width},0 
          l0,${-height}
          l${-width},0 l0,${drawProps.heightMargin}`}
        fillOpacity="0"
      />
    </g>
  )
}

export { Var }
export { Abs }
export { Appl }
