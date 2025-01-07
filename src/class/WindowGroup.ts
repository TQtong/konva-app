import Konva from 'konva'

import { createShape } from './FrameClass'
import { addEvent, calculateScalePoints } from '@/utils/shape'
import FrameClass from './FrameClass'
import CommonData from './CommonData'

const WindowGroupClickEvent = {
  click: function (e) {
    // 一级父组件
    const windowGroup = this.parent
    // const shape = e.target.parent.attrs.shape;
    const shape = this.attrs.shape
    console.log('windowGroupClick======================', e.target)

    // if (CommonData.mouseStatus === 20101) {
    //     var mousePos = e.currentTarget.getStage().getRelativePointerPosition();
    //     windowGroup.destroyChildren();
    //     const cs = new VerticalCentrePost(shape, 1, mousePos).createKonvaGroups();
    //     calcWindowGroup(cs);
    //     windowGroup.add(...cs.children);
    //     CommonData.mouseStatus = 0;
    //     return;
    // }

    if (windowGroup.children[0].children.length !== 0) {
      if (CommonData.mouseStatus > 20000 && CommonData.mouseStatus < 30000) {
        const mousePos = e.currentTarget.getStage().getRelativePointerPosition()
        // const cs = new VerticalCentrePost(shape, 1, mousePos).createKonvaGroups();
        const centrePostGroups = CommonData.getCentrePost(CommonData.mouseStatus, shape, mousePos)
        console.log('单击事件')
        console.log(centrePostGroups.attrs.sides)
        for (const t of centrePostGroups.children) {
          console.log(t)
        }
        // calcWindowGroup(cs);
        windowGroup.destroyChildren()
        console.log('centrePostGroups is ')
        console.log(centrePostGroups)
        windowGroup.add(...centrePostGroups.children)
        CommonData.mouseStatus = 0
        return
      }
    }

    // 防盗坑位
    if (windowGroup.children[1].children.length === 0) {
      if (CommonData.mouseStatus === 30301) {
        const eval1 = CommonData.getWindow(CommonData.mouseStatus, shape)
        windowGroup.children[1].add(...eval1.children)
        windowGroup.children[0].destroyChildren()
      }
    }
    // 玻窗坑位
    if (windowGroup.children[2].children.length === 0) {
      if (
        CommonData.mouseStatus === 30201 ||
        CommonData.mouseStatus === 30202 ||
        CommonData.mouseStatus === 30203 ||
        CommonData.mouseStatus === 30401 ||
        CommonData.mouseStatus === 30402
      ) {
        const eval1 = CommonData.getWindow(CommonData.mouseStatus, shape)
        windowGroup.children[2].add(...eval1.children)
        windowGroup.children[0].destroyChildren()
      }
    }
    // 纱窗坑位
    if (windowGroup.children[3].children.length === 0) {
      if (
        CommonData.mouseStatus === 30101 ||
        CommonData.mouseStatus === 30102 ||
        CommonData.mouseStatus === 30103
      ) {
        const eval1 = CommonData.getWindow(CommonData.mouseStatus, shape)
        windowGroup.children[3].add(...eval1.children)
        windowGroup.children[0].destroyChildren()
      }
    }
    CommonData.mouseStatus = 0
  },
  mousedown: function (e) {
    // console.log('Mouse down on circle!');
    // 你可以在这里添加你的逻辑
    console.log(this.parent)
    const windowGroup = this.parent
    const condition1 = this.attrs.shape
    // const condition1 = windowGroup.children[0] && windowGroup.children[0].attrs.type && windowGroup.children[0].attrs.type === 30000;
    const condition2 = CommonData.mouseStatus === 20101 || CommonData.mouseStatus === 20201
    if (condition1 && condition2) {
      const stage = e.currentTarget.getStage()
      const startMousePos = stage.getRelativePointerPosition()
      stage.attrs.startMousePos = stage.getRelativePointerPosition()
      stage.attrs.line = new Konva.Line({
        points: [startMousePos.x, startMousePos.y, startMousePos.x, startMousePos.y],
        stroke: 'blue',
        strokeWidth: 20,
        dash: [29, 20, 0.001, 20],
      })

      stage.attrs.windowGroup = windowGroup
      stage.draggable(false)
      e.currentTarget.add(stage.attrs.line)
    }
  },
}

const config = {
  sceneFunc: sceneFunc,
  fill: 'grey',
  stroke: 'black',
  strokeWidth: 10,
  draggable: true,
}

export default class WindowGroup {
  shape: Konva.Shape

  constructor(shape: Konva.Shape) {
    this.shape = shape
  }

  createKonvaGroup() {
    const windowGroup = new Konva.Group()
    windowGroup.attrs.name = '一级父组件'
    windowGroup.attrs.sides = this.shape.sides

    const group0 = new Konva.Group()
    const group1 = new Konva.Group()
    const group2 = new Konva.Group()
    const group3 = new Konva.Group()
    const group4 = new Konva.Group()
    group0.attrs.name = '二级父组件/玻璃坑位'
    group1.attrs.name = '二级父组件/防盗坑位'
    group2.attrs.name = '二级父组件/玻窗坑位'
    group3.attrs.name = '二级父组件/纱窗坑位'
    group4.attrs.name = '二级父组件/点击事件层'
    windowGroup.add(group0)
    windowGroup.add(group1)
    windowGroup.add(group2)
    windowGroup.add(group3)
    windowGroup.add(group4)

    // 初始化玻璃
    const window = new Window(this.shape).createKonvaGroup()
    group0.add(...window.children)
    group4.add(
      createShape(
        getAllPoints(this.shape.attrs.sides),
        WindowGroup.clickParam,
        false,
        '点击层图形对象',
        null,
      ),
    )
    group4.attrs.shape = this.shape
    // ********* jh add ********//
    windowGroup.attrs.sides = this.shape.attrs.sides

    // 虚拟层点击事件, 最顶层图层
    addEvent([group4], WindowGroupClickEvent)

    // group4.on('click', WindowGroup.windowGroupClick)
    // group4.attrs.event = {'click': 'WindowGroup.windowGroupClick'};

    return windowGroup
  }

  // 点击层属性
  static clickParam = {
    sceneFunc: sceneFunc,
    fill: 'rgba(255,255,255,0.0)',
    stroke: 'black',
    strokeWidth: 10,
    draggable: false,
  }
  // 胶条属性
  static gasketParam = {
    sceneFunc: sceneFunc,
    fill: 'grey',
    stroke: 'black',
    strokeWidth: 10,
  }
  // 玻璃属性
  static glassParam = {
    sceneFunc: sceneFunc,
    fill: 'rgba(1,1,1,0.2)',
    stroke: 'black',
    strokeWidth: 10,
  }
}

// 取图形的所有点, 包括圆弧与圆心, 闭合集合
const getAllPoints = (sides) => {
  const pointList = []
  for (let i = 0; i < sides.length; i++) {
    pointList.push(sides[i].p1)

    /*********jh**********/
    if (sides[i].centerPoint !== null) {
      pointList.push(sides[i].centerPoint)
    }
    /**********jh*********/

    // var centerX = sides[i].line.centerX;
    // var centerY = sides[i].line.centerY;
    // if (centerX !== -1 && centerY !== -1) {
    //     const centerPoint = Point.create(centerX, centerY)
    //     centerPoint.center = true
    //     pointList.push(centerPoint)
    // }
    // 闭环
    if (i === sides.length - 1) pointList.push(sides[i].p2)
  }
  return pointList
}

class Window {
  shape: Konva.Shape

  constructor(shape: Konva.Shape) {
    this.shape = shape
  }

  createKonvaGroup() {
    const windowGroupList = new Konva.Group()
    const windowGroup = new Konva.Group()
    windowGroup.attrs.name = '三级父组件'
    windowGroup.attrs.sides = this.shape.attrs.sides
    windowGroup.attrs.type = 30000

    windowGroupList.add(windowGroup)
    Window.cal(windowGroup)
    return windowGroupList
  }

  static cal(windowGroup) {
    const points1 = getAllPoints(windowGroup.attrs.sides) // 第一圈
    const points2 = calculateScalePoints(points1, -20) // 第二圈

    // 玻璃
    const windowGlassGroup = new Konva.Group()
    windowGlassGroup.attrs.name = '玻璃父组件'
    windowGlassGroup.add(new Konva.Shape(WindowGroup.glassParam))
    const newWindowGlassShape = createShape(points1, config, false, 'shape', null)
    windowGlassGroup.children[0].attrs.sides = newWindowGlassShape.attrs.sides // 玻璃
    windowGlassGroup.children[0].attrs.sceneFuncStr = 'FunctionUtils.sceneFunc'

    // 胶条
    const windowGasketGroup = new Konva.Group()
    windowGasketGroup.attrs.name = '胶条父组件'
    const newWindowGasketGroup = new FrameClass(
      [
        {
          outerPoints: points1,
          interPoints: points2,
        },
      ],
      null,
      null,
    ).createKonvaGroup()
    for (let i = 0; i < windowGroup.attrs.sides.length; i++) {
      windowGasketGroup.add(new Konva.Shape(WindowGroup.gasketParam))
      windowGasketGroup.children[i].attrs.sides = newWindowGasketGroup.children[i].attrs.sides
      windowGasketGroup.children[i].attrs.sceneFuncStr = 'FunctionUtils.sceneFunc'
    }

    windowGroup.destroyChildren()
    windowGroup.add(windowGlassGroup)
    windowGroup.add(windowGasketGroup)
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
