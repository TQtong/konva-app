import FrameClass from './FrameClass'
import { createShape } from '@/class/FrameClass'
import {
  calculateScalePoints,
  createConDragRectGroup,
  addEvent,
  createMidDragRectGroup,
  getRectLeftRight,
  getAdjacentShape,
} from '@/utils/shape'
import WindowGroup from './WindowGroup'

const config = {
  sceneFunc: sceneFunc,
  fill: 'grey',
  stroke: 'black',
  strokeWidth: 10,
  draggable: true,
}

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

const SymmetryStretchEvent = {
  dragstart: function (e) {
    this.startX = e.target.x()
    this.startY = e.target.y()
  },
  dragend: function (e) {
    const x = e.target.x() - this.startX
    const y = e.target.y() - this.startY

    // const leftShape = this.attrs.leftShape;
    // const rightShape = this.attrs.rightShape;

    const leftRightShape = getRectLeftRight(this)
    const leftShape = leftRightShape[0]
    const rightShape = leftRightShape[1]

    const leftShapeKind = getShapeKind(leftShape)
    const rightShapeKind = getShapeKind(rightShape)

    console.log('conPointDragEnd2 test')
    console.log(leftShapeKind)
    console.log(rightShapeKind)

    if (leftShapeKind === 1) {
      console.log('leftShapeKind is 1')
      // 单个拉长只支持水平方向，实现为两端拉长
      leftShape.attrs.sides[0].p2.x += x
      leftShape.attrs.sides[2].p1.x += x
      leftShape.attrs.sides[0].p1.x -= x
      leftShape.attrs.sides[2].p2.x -= x
      const adjShapes = getAdjacentShape(leftShape)
      calcPoint(adjShapes[0])
      calcPoint(adjShapes[1])
    } else if (rightShapeKind === 1) {
      console.log('rightShapeKind is 1')
      // 单个拉长只支持水平方向，实现为两端拉长
      rightShape.attrs.sides[0].p1.x += x
      rightShape.attrs.sides[2].p2.x += x
      rightShape.attrs.sides[0].p2.x -= x
      rightShape.attrs.sides[2].p1.x -= x
      const adjShapes = getAdjacentShape(rightShape)
      calcPoint(adjShapes[0])
      calcPoint(adjShapes[1])
    } else {
      // 两端拉长只支持垂直方向，实现为两端拉长
      // rightShape.attrs.sides[0].p1.y += y;
      if (leftShape.attrs.sides[0].p1.y === rightShape.attrs.sides[0].p2.y) {
        // 垂直拉伸
        rightShape.attrs.sides[0].p1.y += y
        const symmetryShape = getSymmetryShape(rightShape)
        symmetryShape.attrs.sides[0].p1.y -= y
      } else if (leftShape.attrs.sides[0].p1.x === rightShape.attrs.sides[0].p2.x) {
        // 水平拉伸
        rightShape.attrs.sides[0].p1.x += x
        const symmetryShape = getSymmetryShape(rightShape)
        symmetryShape.attrs.sides[0].p1.x -= x
      }

      calcPoint(leftShape)
      calcPoint(rightShape)
      calcPoint(getSymmetryShape(leftShape))
      calcPoint(getSymmetryShape(rightShape))
    }
  },
}

// 连接点拖动事件:拉长
const conPointEvent2 = {
  dragstart: function (e) {
    this.startX = e.target.x()
    this.startY = e.target.y()
  },
  dragend: function (e) {
    const x = e.target.x() - this.startX
    const y = e.target.y() - this.startY

    // const leftShape = this.attrs.leftShape;
    // const rightShape = this.attrs.rightShape;

    const leftRightShape = getRectLeftRight(this)
    const leftShape = leftRightShape[0]
    const rightShape = leftRightShape[1]

    const leftShapeKind = getShapeKind(leftShape)
    const rightShapeKind = getShapeKind(rightShape)

    console.log('conPointDragEnd2 test')
    console.log(leftShapeKind)
    console.log(rightShapeKind)

    if (leftShapeKind === 1) {
      console.log('leftShapeKind is 1')
      // 单个拉长只支持水平方向，实现为两端拉长
      leftShape.attrs.sides[0].p2.x += x
      leftShape.attrs.sides[2].p1.x += x
      // leftShape.attrs.sides[0].p1.x -= x;
      // leftShape.attrs.sides[2].p2.x -= x;
      const adjShapes = getAdjacentShape(leftShape)
      calcPoint(adjShapes[0])
      calcPoint(adjShapes[1])
    } else if (rightShapeKind === 1) {
      console.log('rightShapeKind is 1')
      // 单个拉长只支持水平方向，实现为两端拉长
      rightShape.attrs.sides[0].p1.x += x
      rightShape.attrs.sides[2].p2.x += x
      // rightShape.attrs.sides[0].p2.x -= x;
      // rightShape.attrs.sides[2].p1.x -= x;
      const adjShapes = getAdjacentShape(rightShape)
      calcPoint(adjShapes[0])
      calcPoint(adjShapes[1])
    } else {
      // 两个拉长只支持垂直方向，实现为一端拉长
      rightShape.attrs.sides[0].p1.y += y
      calcPoint(leftShape)
      calcPoint(rightShape)
    }
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
    frameGroup.attrs.type = 11301
    // // 门窗
    // const shape = createShape(interPoints, config, false, 'GlassShape', null)
    // const windowGroup = new WindowGroup(shape).createKonvaGroup()

    // // 拖动矩形块组
    // const conRectGroup = createConDragRectGroup(frameGroup)
    // const midRectGroup = createMidDragRectGroup(frameGroup)

    // if (this.sideNum === 3) {
    //   addEvent([conRectGroup.children[1], conRectGroup.children[2]], SymmetryStretchEvent)
    //   addEvent([conRectGroup.children[0]], conPointEvent2)
    // }

    // 门窗 拖动矩形块
    return [frameGroup]
  }
}
function sceneFunc(ctx) {
  ctx.beginPath()
  ctx.moveTo(this.attrs.sides[0].p1.x, this.attrs.sides[0].p1.y)
  debugger
  for (const side of this.attrs.sides) {
    side.draw(ctx)
  }
  ctx.closePath()
  ctx.fillStrokeShape(this)
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

const getShapeKind = (shape) => {
  if (!shape) {
    return 0
  }
  if (shape.attrs.sides[0].isStraightLine()) {
    if (shape.attrs.sides[0].p1.x === shape.attrs.sides[0].p2.x) {
      return 2
    } else if (shape.attrs.sides[0].p1.y === shape.attrs.sides[0].p2.y) {
      return 1
    } else {
      return 3
    }
  } else {
    return 4
  }
}

const calcPoint = (shape) => {
  if (getShapeKind(shape) === 4) {
    console.log('重新计算圆心')
    console.log(shape.attrs.sides[0].p1)
    console.log(shape.attrs.sides[0].centerPoint)
    console.log(shape.attrs.sides[0].p2)
    console.log(shape.attrs.sides[0].ang)

    console.log('计算出的圆心夹角')
    console.log(shape.attrs.sides[0].calcCenterAng())

    shape.attrs.sides[0].calcCenterPoint()
    console.log(shape.attrs.sides[0].p1)
    console.log(shape.attrs.sides[0].centerPoint)
    console.log(shape.attrs.sides[0].p2)
    console.log(shape.attrs.sides[0].ang)
  }
  const adjShapes = getAdjacentShape(shape)
  const leftShape = adjShapes[0]
  const rightShape = adjShapes[1]

  const point1 = calcSideIntersectPoint(leftShape.attrs.sides[0], shape.attrs.sides[0])
  const point2 = calcSideIntersectPoint(shape.attrs.sides[0], rightShape.attrs.sides[0])

  shape.attrs.sides[2].p2.x = point1.x
  shape.attrs.sides[2].p2.y = point1.y
  shape.attrs.sides[2].p1.x = point2.x
  shape.attrs.sides[2].p1.y = point2.y
}

const calcSideIntersectPoint = (side1, side2) => {
  const outerPoints = []
  if (side1.isStraightLine()) {
    outerPoints.push(side1.p1)
    outerPoints.push(side1.p2)
  } else {
    outerPoints.push(side1.p1)
    outerPoints.push(side1.centerPoint)
    outerPoints.push(side1.p2)
  }
  if (side2.isStraightLine()) {
    outerPoints.push(side2.p2)
  } else {
    outerPoints.push(side2.centerPoint)
    outerPoints.push(side2.p2)
  }

  const interPoints = calculateScalePoints(outerPoints, -60)

  if (side1.isStraightLine()) {
    return interPoints[1]
  } else {
    return interPoints[2]
  }
}

const getSymmetryShape = (shape) => {
  const group = shape.parent

  if (group.attrs.type === 11101) {
    if (shape.index === 2) {
      return group.children[4]
    } else if (shape.index === 4) {
      return group.children[2]
    }
  }

  const length = group.children.length
  if (length % 2 === 1) {
    // 奇数
    return group.children[length - 1 - shape.index]
  } else {
    // 偶数
    return group.children[(shape.index + length / 2) % length]
  }
}
