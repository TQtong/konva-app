import FrameClass from './FrameClass'
import { calculateScalePoints, getAdjacentShape } from '@/utils/shape'

const shapeScaleEvent = {
  dragstart: function (e) {
    this.startX = e.target.x()
    this.startY = e.target.y()
    const mousePos = e.currentTarget.getStage().getRelativePointerPosition()
    this.startMouseX = mousePos.x
    this.startMouseY = mousePos.y
  },
  dragend: function (e) {
    const x = e.target.x() - this.startX
    const y = e.target.y() - this.startY

    move(this, x, y)

    e.target.x(0)
    e.target.y(0)
  },
}

export class PolygonClass {
  sideNum = 3

  createKonvaGroups(outerPoints) {
    const interPoints = calculateScalePoints(outerPoints, -60)

    const frameGroup = new FrameClass(
      [
        {
          outerPoints: outerPoints,
          interPoints: interPoints,
        },
      ],
      null,
      shapeScaleEvent,
    ).createKonvaGroup()

    return [frameGroup]
  }
}

export const move = (shape, x, y) => {
  console.log('translate ' + x + ',' + y)
  const sides = shape.attrs.sides
  const side0 = sides[0]
  if (side0.p1.x === side0.p2.x) {
    // 竖线，只能水平移动
    console.log('水平移动')
    y = 0
  } else if (side0.p1.y === side0.p2.y) {
    // 横线，只能垂直移动
    console.log('垂直移动')
    x = 0
  } else {
    console.log('斜线')
    // 斜线，水平垂直移动
    const adjShapes = getAdjacentShape(shape)
    if (
      adjShapes[0].attrs.sides[0].p1.x === adjShapes[0].attrs.sides[0].p2.x ||
      adjShapes[1].attrs.sides[0].p1.x === adjShapes[1].attrs.sides[0].p2.x
    ) {
      // 横线，只能垂直移动
      x = 0
    } else if (
      adjShapes[0].attrs.sides[0].p1.y === adjShapes[0].attrs.sides[0].p2.y ||
      adjShapes[1].attrs.sides[0].p1.y === adjShapes[1].attrs.sides[0].p2.y
    ) {
      // 竖线，只能水平移动
      y = 0
    } else {
      return
    }
  }

  console.log('大小：' + sides[0].line.sideSet.size)

  const points = getShapeRelatePoints(shape)
  console.log('points length is ' + points.length)
  for (const point of points) {
    point.x += x
    point.y += y
  }
}

const getShapeRelatePoints = (shape) => {
  const allSides = []
  const sides = shape.attrs.sides
  allSides.push(...sides)
  allSides.push(...sides[0].getOtherShapeSideSet())
  allSides.push(...sides[2].getOtherShapeSideSet())
  const pointSet = new Set()
  for (const side of allSides) {
    pointSet.add(side.p1)
    pointSet.add(side.p2)
    if (side.centerPoint) {
      pointSet.add(side.centerPoint)
    }
  }
  return [...pointSet]
}
