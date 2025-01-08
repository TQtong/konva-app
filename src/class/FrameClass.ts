import Konva from 'konva'

import { type IPoint } from '@/interfaces/IShape'

import { SideClass } from './SideClass'

const config = {
  sceneFunc: sceneFunc,
  fill: 'grey',
  stroke: 'black',
  strokeWidth: 10,
  draggable: true,
}

const dragConfig = {
  sceneFunc: sceneFunc,
  fill: 'grey',
  stroke: 'black',
  strokeWidth: 10,
  draggable: true,
}

const notDragConfig = {
  sceneFunc: sceneFunc,
  fill: 'grey',
  stroke: 'black',
  strokeWidth: 10,
  draggable: false,
}

interface IFragment {
  outerPoints: IPoint[]
  interPoints: IPoint[]
}

interface IConfig {
  sceneFunc: any
  fill: string
  stroke: string
  strokeWidth: number
  draggable: boolean
}

// 通用
export default class FrameClass {
  fragments: IFragment[]
  groupEvent: any
  shapeEvent: any
  config: IConfig

  constructor(fragments: IFragment[], groupEvent: any = null, shapeEvent) {
    this.fragments = fragments
    this.groupEvent = groupEvent
    this.shapeEvent = shapeEvent
    this.config = config
  }

  createKonvaGroup() {
    const frame = new Konva.Group()

    for (let i = 0; i < this.fragments.length; i++) {
      const outerPoints = this.fragments[i].outerPoints
      const interPoints = this.fragments[i].interPoints
      for (let i = 0; i < outerPoints.length - 1; ) {
        if (true === outerPoints[i + 1].center) {
          // 弧线段
          const center1 = outerPoints[i + 1]
          const p1 = outerPoints[i]
          const p2 = outerPoints[i + 2]
          const center2 = interPoints[i + 1]
          const p3 = interPoints[i + 2]
          const p4 = interPoints[i]

          // paramJson = p1.x === p2.x || p1.y === p2.y ? dragParamJson : notDragParamJson;
          const shape = createShape(
            [p1, center1, p2, p3, center2, p4, p1],
            this.config,
            true,
            'shape' + i,
            this.shapeEvent,
          )
          // shape.attrs.sides[2].counterClockwise = !shape.attrs.sides[0].counterClockwise;
          // center2.counterClockwise = !center1.counterClockwise;
          frame.add(shape)
          i += 2
        } else {
          // 直线段
          const p1 = outerPoints[i]
          const p2 = outerPoints[i + 1]
          const p3 = interPoints[i + 1]
          const p4 = interPoints[i]
          // paramJson = p1.x === p2.x || p1.y === p2.y ? dragParamJson : notDragParamJson;
          const shape = createShape(
            [p1, p2, p3, p4, p1],
            this.config,
            true,
            'shape' + i,
            this.shapeEvent,
          )
          frame.add(shape)
          i++
        }
      }
    }

    for (const key in this.groupEvent) {
      if (this.groupEvent.hasOwnProperty(key)) {
        // 确保是对象自有属性
        console.log(key + ': ' + this.groupEvent[key])
        frame.on(key, this.groupEvent[key])
      }
    }

    return frame
  }
}

/**
 * @description: 计算起点终点
 * @param {IPoint[]} points 点集
 * @param {IConfig} config 配置
 * @param {boolean} diffside 是否区分内外
 * @param {string} name 名称
 * @param {any} event 事件
 * @return {*}
 */
export const createShape = (
  points: IPoint[],
  config: IConfig,
  diffside: boolean,
  name: string,
  event: any,
) => {
  const sides = []
  let sideNo = 0
  for (let i = 0; i < points.length - 1; ) {
    const type = diffside ? (sideNo % 2 === 0 ? 1 : 2) : 0
    if (true === points[i + 1].center) {
      // 弧线
      const p1 = points[i]
      const centerPoint = points[i + 1]
      const p2 = points[i + 2]
      sides.push(new SideClass(type, centerPoint, p1, p2))
      i += 2
    } else {
      // 直线
      const p1 = points[i]
      const p2 = points[i + 1]
      sides.push(new SideClass(type, null, p1, p2))
      i += 1
    }
    sideNo++
  }
  console.log(sides)

  debugger
  const konvaShape = new Konva.Shape(config)
  // konvaShape.attrs.name = name
  konvaShape.attrs.sides = sides
  // // konvaShape.attrs.sceneFuncStr = 'FunctionUtils.sceneFunc'
  // konvaShape.attrs.event = event
  // if (config.draggable && event !== null) {
  //   for (const key in event) {
  //     if (event.hasOwnProperty(key)) {
  //       // 确保是对象自有属性
  //       // konvaShape.on(key, event[key]);
  //       konvaShape.on(key, eval(event[key]))
  //     }
  //   }
  // }

  return konvaShape
}

function sceneFunc(ctx) {
  ctx.beginPath()
  ctx.moveTo(this.attrs.sides[0].p1.x, this.attrs.sides[0].p1.y)

  for (const side of this.attrs.sides) {
    side.draw(ctx)
  }
  ctx.closePath()
  ctx.fillStrokeShape(this)
}
