declare module 'react-charts' {
  import { ComponentType } from 'react'

  export interface AxisOptions<TDatum = any> {
    primary?: boolean
    type: 'linear' | 'ordinal' | 'time' | 'utc' | 'log'
    position: 'top' | 'right' | 'bottom' | 'left'
    [key: string]: any
  }

  export interface ChartProps {
    data: any[]
    axes: AxisOptions<any>[]
    series?: {
      type: 'line' | 'bar' | 'area' | 'bubble'
      [key: string]: any
    } | ((series: any) => any)
    getPrimary: (datum: any) => any
    getSecondary: (datum: any) => any
    dark?: boolean
    [key: string]: any
  }

  export const Chart: ComponentType<ChartProps>
}
