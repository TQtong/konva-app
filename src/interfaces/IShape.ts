export interface IPoint {
  x: number
  y: number
  center?: any
}

export interface ILine {
  p1: IPoint
  p2: IPoint
}

export interface ICircle {
  x: number
  y: number
  radius: number
}
