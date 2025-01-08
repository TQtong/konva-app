import { type IPoint } from '@/interfaces/IShape'

import {
  calculateArcCircleCenter,
  calculateArcLengthAndMidPoint,
  distance,
  calculatePointC,
  calculateAngles,
  areLinesCollinear,
  isCounterClockwise,
  calculateRadius,
  calEndPoint,
} from '@/utils/shape/index'

export class SideClass {
  type: number // 类型
  centerPoint: IPoint | null // 圆心
  p1: IPoint // 点1
  p2: IPoint // 点2
  line: LineClass // 线
  angle: number = 0 // 角度

  // 构造函数 type 1 是长 2 是宽
  constructor(type: number, center: IPoint | null = null, p1: IPoint, p2: IPoint) {
    this.type = type
    this.p1 = p1
    this.p2 = p2
    if (typeof center === 'undefined' || center === null || center.x === -1 || center.y === -1) {
      this.line = LineClass.create(-1, -1, p1.x, p1.y, p2.x, p2.y)
      this.centerPoint = null
    } else {
      this.line = LineClass.create(center.x, center.y, p1.x, p1.y, p2.x, p2.y)
      this.centerPoint = center
      this.centerPoint.center = true
      // 在外面手动设置方向
      // if (this.centerPoint.counterClockwise) {
      //     this.counterClockwise = this.centerPoint.counterClockwise;
      // } else {
      //     const mp = calculateArcLengthAndMidPoint(this.p1, this.p2, this.centerPoint);
      //     // 和数学上相反
      //     this.counterClockwise = !isCounterClockwise(this.p1, mp, this.p2);
      //     this.centerPoint.counterClockwise = this.counterClockwise;
      // }
      // const mp = calculateArcLengthAndMidPoint(this.p1, this.p2, this.centerPoint);
      // this.counterClockwise = !isCounterClockwise(this.p1, mp, this.p2);

      this.angle = this.calcCenterAngle()
    }
    this.line.addSide(this)
  }

  // 更新圆心，同时更新圆心夹角
  updateCenterPoint(newCenterPoint) {
    if (!this.centerPoint) {
      this.centerPoint = {
        x: newCenterPoint.x,
        y: newCenterPoint.y,
      }
      this.centerPoint.center = true
      // for (const side of this.line.sideSet) {
      //     side.centerPoint = this.centerPoint;
      // }
    } else {
      this.centerPoint.x = newCenterPoint.x
      this.centerPoint.y = newCenterPoint.y
    }
    this.angle = this.calcCenterAngle()
    // 其他边的ang是否要一起改变
  }

  // 根据端点和圆心角计算新的圆心坐标
  calcCenterPoint() {
    const newCenterPoint = calculateArcCircleCenter(this.p1, this.p2, this.angle)
    this.centerPoint.x = newCenterPoint.x
    this.centerPoint.y = newCenterPoint.y
  }

  isStraightLine() {
    return this.centerPoint === null
  }

  getOtherShapeSideSet() {
    const set = new Set()
    for (const side of this.line.sideSet) {
      if (side !== this) {
        set.add(side)
      }
    }
    return set
  }

  // 边弯曲
  bend(dis) {
    const midPoint = calculateArcLengthAndMidPoint(this.p1, this.p2, this.centerPoint)
    // const midPoint = calculateArcLengthAndMidPoint(this.p1, this.p2, new Point(this.line.centerX, this.line.centerY));
    const radius = distance(this.centerPoint, midPoint)
    const newMidPoint = calculatePointC(this.centerPoint, midPoint, radius + dis)
    const result = calculateAngles(this.p1, newMidPoint, this.p2)
    this.centerPoint.x = result.centerX
    this.centerPoint.y = result.centerY
    this.line.centerX = result.centerX
    this.line.centerY = result.centerY
  }

  // 计算线段中间点
  calcMidPoint() {
    if (this.centerPoint === null) {
      return {
        x: (this.p1.x + this.p2.x) / 2,
        y: (this.p1.y + this.p2.y) / 2,
      }
    } else {
      return calculateArcLengthAndMidPoint(this.p1, this.p2, this.centerPoint)
    }
  }

  // 计算圆心夹角
  calcCenterAngle() {
    const midPoint = calculateArcLengthAndMidPoint(this.p1, this.p2, this.centerPoint)
    const result = calculateAngles(this.p1, midPoint, this.p2)
    return Math.abs(result.endAngle - result.startAngle)
  }

  draw(context) {
    if (this.isStraightLine()) {
      // 直线
      context.lineTo(this.p2.x, this.p2.y)
    } else {
      // console.log('draw arc');
      // 弧线
      // var mp = calculateArcLengthAndMidPoint(this.p1, this.p2, this.line.getCenter());
      const mp = calculateArcLengthAndMidPoint(this.p1, this.p2, this.centerPoint)
      const params = calculateAngles(this.p1, mp, this.p2)
      const arcX = params.centerX
      const arcY = params.centerY
      const r = params.radius
      const startAngle = params.startAngle
      const endAngle = params.endAngle
      // 数学上和canvas中的相反
      let direction
      if (this.counterClockwise) {
        direction = this.counterClockwise
      } else {
        direction = !isCounterClockwise(this.p1, mp, this.p2)
      }
      // direction = !isCounterClockwise(this.p1, mp, this.p2);

      console.log('jhxxx direction is ' + direction)
      context.arc(arcX, arcY, r, startAngle, endAngle, direction)
    }
  }

  // 普通函数
  print() {
    console.log('side-' + this.name)
    this.p1.print()
    this.p2.print()
    // this.line.print();
  }
}

export class LineClass {
  static count = 0

  centerX: number = 0
  centerY: number = 0
  x1: number
  y1: number
  x2: number
  y2: number
  name: number

  sideSet: Set<SideClass>

  getCenter() {
    return {
      x: this.centerX,
      y: this.centerY,
    }
  }

  getP1() {
    return {
      x: this.x1,
      y: this.y1,
    }
  }

  getP2() {
    return {
      x: this.x2,
      y: this.y2,
    }
  }

  // 构造函数
  constructor(centerX: number, centerY: number, x1: number, y1: number, x2: number, y2: number) {
    if (this.centerX !== -1 && this.centerY !== -1) {
      this.centerX = centerX
      this.centerY = centerY
    }
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.sideSet = new Set()
    this.name = ++LineClass.count
  }

  // 是否直线
  isStraightLine() {
    if (typeof this.centerX === 'undefined' || typeof this.centerY === 'undefined') {
      return true
    }
    if (this.centerX === -1 || this.centerY === -1) {
      return true
    }
    return false
  }

  addSide(side) {
    this.sideSet.add(side)
  }

  // 普通函数
  // print() {
  //     if (this.isStraightLine()) {
  //         console.log(`序号：${this.name}; p1端点：${this.x1},${this.y1}; p2端点：${this.x2},${this.y2}`);
  //     } else {
  //         const p1 = new Point(this.x1, this.y1);
  //         const p2 = new Point(this.x2, this.y2);
  //         const center = new Point(this.centerX, this.centerY);
  //         const midPoint = calculateArcLengthAndMidPoint(p1, p2, center);
  //         console.log(`序号：${this.name}; 圆心：${this.centerX},${this.centerY}; p1端点：${this.x1},${this.y1}; 中间点：${midPoint.x},${midPoint.y}; p2端点：${this.x2},${this.y2}`);
  //     }
  // }

  static lineSet = new Set()

  static lineMap = new Map()

  static create(centerX: number, centerY: number, x1: number, y1: number, x2: number, y2: number) {
    if (centerX === -1 && centerY === -1) {
      return LineClass.createStraightLine(x1, y1, x2, y2)
    } else {
      return LineClass.createArc(centerX, centerY, x1, y1, x2, y2)
    }
  }

  static createStraightLine(x1: number, y1: number, x2: number, y2: number) {
    const curp1 = {
      x: x1,
      y: y1,
    }
    const curp2 = {
      x: x2,
      y: y2,
    }
    for (const line of LineClass.lineSet) {
      const p1 = line.getP1()
      const p2 = line.getP2()
      if (line.isStraightLine() && areLinesCollinear(p1, p2, curp1, curp2)) {
        const flag1 = Math.min(curp1.x, curp2.x) > Math.max(p1.x, p2.x)
        const flag2 = Math.min(curp1.y, curp2.y) > Math.max(p1.y, p2.y)
        const flag3 = Math.max(curp1.x, curp2.x) < Math.min(p1.x, p2.x)
        const flag4 = Math.max(curp1.y, curp2.y) < Math.min(p1.y, p2.y)

        if (flag1 || flag2 || flag3 || flag4) {
          // 左上角和右下角矩形连接线是相同线的问题
        } else {
          const newP = calEndPoint(p1, p2, curp1, curp2)
          line.x1 = newP[0].x
          line.y1 = newP[0].y
          line.x2 = newP[1].x
          line.y2 = newP[1].y
          return line
        }
      }
    }
    const newLine = new LineClass(-1, -1, x1, y1, x2, y2)
    LineClass.lineSet.add(newLine)
    return newLine
  }

  static createArc(centerX, centerY, x1, y1, x2, y2) {
    const r1 = calculateRadius(
      {
        x: centerX,
        y: centerY,
      },
      {
        x: x1,
        y: y1,
      },
    )

    for (const line of LineClass.lineSet) {
      if (!line.isStraightLine() && line.centerX === centerX && line.centerY === centerY) {
        const r2 = calculateRadius(line.getCenter(), line.getP1())
        if (r1 === r2) {
          return line
        }
      }
    }
    const newLine = new LineClass(centerX, centerY, x1, y1, x2, y2)
    LineClass.lineSet.add(newLine)
    return newLine
  }
}
