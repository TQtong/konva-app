import { type IPoint, type ILine, type ICircle } from '@/interfaces/IShape'
import Konva from 'konva'
import { move } from '@/class/Polygon'

/**
 * @description: 根据中心点坐标、边长、起始角度, 计算正n多边形各个顶点的坐标
 * @param {number} centerX 中心点x坐标
 * @param {number} centerY 中心点y坐标
 * @param {number} segment 正n边形边数
 * @param {number} sideLength 边长
 * @param {number} startAngle 起始角度
 * @return {*}
 */
export const getVertices = (
  centerX: number,
  centerY: number,
  segment: number,
  sideLength: number,
  startAngle: number,
) => {
  const radius = sideLength / (2 * Math.sin(Math.PI / segment)) // 计算外接圆半径
  const vertices = []
  const angleOffset = (startAngle * Math.PI) / 180 // 将角度转换为弧度
  for (let i = 0; i < segment; i++) {
    const angle = angleOffset + ((2 * Math.PI) / segment) * i
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    vertices.push({ x, y })
  }
  return vertices
}

/**
 * @description: 计算给定点集合围成的多边形的缩放后的点的集合, scale 正数表示扩大的宽度,负数表示缩小的宽度
 * @param {IPoint[]} pointsArray 给定点集合
 * @param {number} scale 缩放比例
 * @return {*}
 */
export const calculateScalePoints = (pointsArray: IPoint[], scale: number) => {
  scale = scale * -1
  const scalePoints: IPoint[] = []
  let prev2, prev1
  let closed = true
  const points = pointsArray.slice()
  // 如何不是闭合的点集合,则追加第1个点到尾部方便计算
  if (points[0].x != points[points.length - 1].x || points[0].y != points[points.length - 1].y) {
    points.push(points[0])
    closed = false
  }
  for (let i = 0; i < points.length - 1; i++) {
    if (i == 0) {
      prev2 = points[(i - 3 + points.length) % points.length]
      prev1 = points[(i - 2 + points.length) % points.length]
    } else {
      prev2 = points[(i - 2 + points.length) % points.length]
      prev1 = points[(i - 1 + points.length) % points.length]
    }
    const A1 = points[i]
    const A2 = points[i + 1]
    const A3 = points[i + 2]
    let scalePoint
    if (prev1.center && !A2.center) {
      // 圆弧与直线
      if (areLinesCollinear(prev2, prev1, prev1, A1)) {
        //arc 为半圆, 圆弧起点的切线和圆心中心点的直线平行, 用缩放后的圆与平移的直线求交点
        const circle = {
          ...prev1,
          radius:
            prev1.counterClockwise == true
              ? distance(A1, prev1) + scale
              : distance(A1, prev1) - scale,
        }
        const line = getParallelLine(A1, A2, -scale) // scale在这里的符号由A1A2顺序决定,就是-
        const scalePoints = getLineCircleIntersections(line, circle)
        if (scalePoints.length == 2) {
          scalePoint =
            distance(scalePoints[0], A1) >= distance(scalePoints[1], A1)
              ? scalePoints[1]
              : scalePoints[0]
        } else if (scalePoints.length == 1) {
          scalePoint = scalePoints[0]
        } else {
          console.error('no interactions')
          return []
        }
      } else {
        const pointC = calculateTangentArcMinddleIntersection(prev2, prev1, A1)
        // 如果俩直线夹角为0度, 则在圆心和该点上进行缩放
        if (
          pointC == null ||
          (A2.y - A1.y) * (pointC.x - A1.x) == (pointC.y - A1.y) * (A2.x - A1.x)
        ) {
          scalePoint = calculatePointC(prev1, A1, distance(prev1, A1) - scale)
        } else {
          scalePoint = calculatePointOnAngleBisectorAtDistance(pointC, A1, A2, scale)
          if (Math.abs(distance(scalePoint, prev1) - distance(prev1, A1) + scale) >= 2) {
            const circle = { ...prev1, radius: distance(prev1, A1) + scale }
            const line = getParallelLine(A1, A2, -scale) // scale在这里的符号由A1A2顺序决定,就是-
            const scalePoints = getLineCircleIntersections(line, circle)
            if (scalePoints.length == 2) {
              scalePoint =
                distance(scalePoints[0], A1) >= distance(scalePoints[1], A1)
                  ? scalePoints[1]
                  : scalePoints[0]
            } else if (scalePoints.length == 1) {
              scalePoint = scalePoints[0]
            } else {
              console.error('no interactions')
              return []
            }
          }
        }
      }
      console.log('arc-line:', JSON.stringify(scalePoint))
      scalePoints.push(scalePoint)
    } else if (prev1.center && A2.center) {
      // 都是圆弧
      // step1: 先求前一个圆弧的切线交点
      const point1 = calculateTangentArcMinddleIntersection(prev2, prev1, A1)
      // step2: 再求当前圆弧的切线的交点
      const point2 = calculateTangentArcMinddleIntersection(A1, A2, A3)
      // step3: 求2个切线交点的平分线上的点
      if ((A1.y - point1.y) * (A1.x - point1.x) == (point2.y - A1.y) * (point2.x - A1.x)) {
        // 如果俩直线夹角为0度, 则在圆心和该点上进行缩放
        scalePoint = calculatePointC(prev1, A1, distance(prev1, A1) - scale)
      } else {
        scalePoint = calculatePointOnAngleBisectorAtDistance(point1, A1, point2, scale)
      }
      console.log('arc-arc:', JSON.stringify(scalePoint))
      scalePoints.push(scalePoint)
      scalePoints.push(A2)
      i++ //跳过圆心
    } else if (!prev1.center && A2.center) {
      // 直线与圆弧
      if (areLinesCollinear(A1, A2, A2, A3)) {
        //arc 为半圆, 圆弧起点的切线和圆心中心点的直线平行, 用缩放后的圆与平移的直线求交点
        const circle = {
          ...A2,
          radius: A2.counterClockwise == true ? distance(A1, A2) + scale : distance(A1, A2) - scale,
        }
        const line = getParallelLine(prev1, A1, -scale) // scale在这里的符号由A1A2顺序决定,就是-
        console.log(JSON.stringify(line), JSON.stringify(circle))
        const scalePoints = getLineCircleIntersections(line, circle)
        if (scalePoints.length == 2) {
          scalePoint =
            distance(scalePoints[0], A1) >= distance(scalePoints[1], A1)
              ? scalePoints[1]
              : scalePoints[0]
        } else if (scalePoints.length == 1) {
          scalePoint = scalePoints[0]
        } else {
          console.error('no interactions')
          return []
        }
      } else {
        const pointC = calculateTangentArcMinddleIntersection(A1, A2, A3)
        if ((pointC.y - A1.y) * (A1.x - prev1.x) == (A1.y - prev1.y) * (pointC.x - A1.x)) {
          scalePoint = calculatePointC(A2, A1, distance(A2, A1) - scale)
        } else {
          scalePoint = calculatePointOnAngleBisectorAtDistance(prev1, A1, pointC, scale)
          // 如果计算出来的点与圆心的距离不是预期的长度则需要矫正, 平移后的直线与缩放圆的交点
          if (Math.abs(distance(scalePoint, A2) - distance(A1, A2) + scale) >= 2) {
            const circle = { ...A2, radius: distance(A1, A2) + scale }
            const line = getParallelLine(prev1, A1, -scale)
            const scalePoints = getLineCircleIntersections(line, circle)
            if (scalePoints.length == 2) {
              scalePoint =
                distance(scalePoints[0], A1) >= distance(scalePoints[1], A1)
                  ? scalePoints[1]
                  : scalePoints[0]
            } else if (scalePoints.length == 1) {
              scalePoint = scalePoints[0]
            } else {
              console.error('no interactions')
              return []
            }
          }
        }
      }
      console.log('line-arc:', JSON.stringify(scalePoint))
      scalePoints.push(scalePoint)
      scalePoints.push(A2)
      i++ //跳过圆心
    } else if (!prev1.center && !A2.center) {
      // 都是直线
      scalePoint = calculatePointOnAngleBisectorAtDistance(prev1, A1, A2, scale)
      //console.log("line-line:", JSON.stringify(scalePoint));
      scalePoints.push(scalePoint)
    }
  }
  // 如果是非闭合图形, 重新计算起点和终点, 目前仅支持最后一个点和倒数第2个点在同一水平线上或同一垂直线上
  if (closed == false) {
    const A1 = points[0]
    const A2 = points[1]
    const prev1 = points[points.length - 2] // 输入的最后一个点
    const prev2 = points[points.length - 3] // 输入的倒数第2个点
    const scalePrev1 = scalePoints[scalePoints.length - 1] // 缩放后的最后1个点
    const scalePrev2 = scalePoints[scalePoints.length - 2] // 缩放后的倒数第2个点
    // 如果前2个点垂直/水平, 重新计算第一个点
    if (A1.x == A2.x) {
      // 如果前2个点垂直, 则该点的x与A2缩放后的x相同,y与A1点相同
      scalePoints[0] = { x: scalePoints[1].x, y: A1.y }
    } else if (A1.y == A2.y) {
      // 如果前2个点水平, 则该点的x与A1的x相同,y与A2缩放后的y相同
      scalePoints[0] = { x: A1.x, y: scalePoints[1].y }
    } else if (A1.x == prev1.x || A1.y == prev1.y) {
      //如果(最后一个点和第一个点构成的边)是垂直的, 那么用缩放后的第一条边与(最后一个点和第一个点构成的边)取交集
      const newOne = getLineLineIntersection(scalePoints[1], scalePoints[0], A1, prev1)[0]
      if (newOne != null) {
        scalePoints[0] = newOne
      } else {
        // 如果交点不存在, 则反向求交点(即在延长线上)
        scalePoints[0] = getLineLineIntersection(A1, prev1, scalePoints[1], scalePoints[0])[0]
      }
    } else {
      console.error('neither vertical nor horizon')
    }
    // 如果后2个点垂直/水平, 重新计算最后一个点
    if (prev1.x == prev2.x) {
      // 如果最后2个点垂直, 则该点的x与缩放后倒数第2个点的x相同, y与最后一点的y相同
      scalePoints[scalePoints.length - 1] = { x: scalePrev2.x, y: prev1.y }
    } else if (prev1.y == prev2.y) {
      // 如果最后2个点水平, 则该点的x与最后一个点的x相同, y与缩放后倒数第2个点的y相同
      scalePoints[scalePoints.length - 1] = { x: prev1.x, y: scalePrev2.y }
    } else if (A1.x == prev1.x || A1.y == prev1.y) {
      // 如果第一个点和最后一个点是垂直/水平的, 那么用缩放后的最后一条边与(最后一个点和第一个点构成的边)取交集
      const newOne = getLineLineIntersection(scalePrev1, scalePrev2, A1, prev1)[0]
      if (newOne != null) {
        scalePoints[scalePoints.length - 1] = newOne
      } else {
        // 如果交点不存在, 则反向求交点(即在延长线上)
        scalePoints[scalePoints.length - 1] = getLineLineIntersection(
          A1,
          prev1,
          scalePrev1,
          scalePrev2,
        )[0]
      }
    } else {
      console.error('neither vertical nor horizon')
    }
  } else {
    // 当输入点是闭合点集合, 追加缩放后的第一个点完成闭合
    scalePoints.push(scalePoints[0])
  }
  return scalePoints
}

/**
 * @description: 线段和线段的交点, 返回类型为数组, 使用时应注意, flag决定返回交点位置:-1只要是交点即可;0必须同时在2条线段上;1必须在第1条线段上;2必须在第2条线段上
 * @param {IPoint} A1 A线段第一个点
 * @param {IPoint} A2 A线段第二个点
 * @param {IPoint} B1 B线段第一个点
 * @param {IPoint} B2 B线段第二个点
 * @param {number} flag 交点位置
 * @return {*}
 */
const getLineLineIntersection = (A1: IPoint, A2: IPoint, B1: IPoint, B2: IPoint, flag = 2) => {
  const x1 = A1.x,
    y1 = A1.y
  const x2 = A2.x,
    y2 = A2.y
  const x3 = B1.x,
    y3 = B1.y
  const x4 = B2.x,
    y4 = B2.y
  // 计算方向向量的分母
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  // 若分母为0，表示两条线平行
  if (denom === 0) return []
  // t用于确定交点在第1条线段上的位置, u用于确定交点在第2条线段上的位置
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
  const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom
  // 根据 flag 判断是否满足交点条件
  if (flag === 0) {
    // 交点必须同时在两条线段上
    if (t < 0 || t > 1 || u < 0 || u > 1) return []
  } else if (flag === 1) {
    // 交点必须在第一条线段上
    if (t < 0 || t > 1) return []
  } else if (flag === 2) {
    // 交点必须在第二条线段上
    if (u < 0 || u > 1) return []
  }
  // flag = -1 时，交点可以在两条线段外，不需要特殊检查
  // 计算交点坐标
  const ix = x1 + t * (x2 - x1)
  const iy = y1 + t * (y2 - y1)
  return [{ x: ix, y: iy }]
}

/**
 * @description: 计算逆时针3个点ABC围成的角ABC的平分线上的点, 到2边的垂直距离均为d
 * @param {IPoint} A A点
 * @param {IPoint} B B点
 * @param {IPoint} C C点
 * @param {number} d 到2边的垂直距离
 * @return {*}
 */
const calculatePointOnAngleBisectorAtDistance = (A: IPoint, B: IPoint, C: IPoint, d: number) => {
  // 转换 Konva 坐标到数学坐标
  const convertToMath = (point: IPoint) => ({ x: point.x, y: -point.y })
  const convertToKonva = (point: IPoint) => ({ x: point.x, y: -point.y })

  // 将输入点转换到数学坐标系
  const mathA = convertToMath(A)
  const mathB = convertToMath(B)
  const mathC = convertToMath(C)

  // 计算向量 BA 和 BC
  const BA = { x: mathA.x - mathB.x, y: mathA.y - mathB.y }
  const BC = { x: mathC.x - mathB.x, y: mathC.y - mathB.y }

  // 计算向量的长度
  const lengthBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y)
  const lengthBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y)

  // 归一化向量
  const unitBA = { x: BA.x / lengthBA, y: BA.y / lengthBA }
  const unitBC = { x: BC.x / lengthBC, y: BC.y / lengthBC }

  // 计算角平分线的方向向量
  let bisector = {
    x: unitBA.x + unitBC.x,
    y: unitBA.y + unitBC.y,
  }
  const lengthBisector = Math.sqrt(bisector.x * bisector.x + bisector.y * bisector.y)
  bisector = { x: bisector.x / lengthBisector, y: bisector.y / lengthBisector }

  // 判断角平分线方向是否需要调整
  const crossProduct = BA.x * BC.y - BA.y * BC.x // 叉积

  if (crossProduct < 0) {
    // 如果叉积为负，则反转角平分线方向
    bisector.x = -bisector.x
    bisector.y = -bisector.y
  }

  // 计算角平分线与向量 BA 的夹角
  const dotProduct = bisector.x * unitBA.x + bisector.y * unitBA.y // 点积
  const cosTheta = dotProduct // 夹角的余弦值
  const sinTheta = Math.sqrt(1 - cosTheta * cosTheta) // 夹角的正弦值

  // 计算目标点到 B 的距离
  const distanceToB = d / sinTheta

  // 计算目标点坐标
  const mathPoint = {
    x: mathB.x + bisector.x * distanceToB,
    y: mathB.y + bisector.y * distanceToB,
  }

  // 判断角度是否超过 270°（通过叉积和点积联合判断）
  const angleGreaterThan270 = crossProduct < 0 && dotProduct < -0.5 // 角度在 270° 到 360°

  // 如果角度超过 270°，取初步点 D 关于 B 的对称点
  let finalPoint = mathPoint
  if (angleGreaterThan270) {
    finalPoint = {
      x: 2 * mathB.x - mathPoint.x,
      y: 2 * mathB.y - mathPoint.y,
    }
  }
  // 将结果转换回 Konva 坐标系
  return convertToKonva(finalPoint)
}

/**
 * @description: 经过2个点的线, 是否重合
 * @param {IPoint} point1 点1
 * @param {IPoint} point2 点2
 * @param {IPoint} point3 点3
 * @param {IPoint} point4 点4
 * @return {*}
 */
export const areLinesCollinear = (
  point1: IPoint,
  point2: IPoint,
  point3: IPoint,
  point4: IPoint,
) => {
  // 计算两条线的方向向量
  const dx1 = point2.x - point1.x
  const dy1 = point2.y - point1.y
  const dx2 = point4.x - point3.x
  const dy2 = point4.y - point3.y

  // 是否平行
  if (dx1 * dy2 !== dy1 * dx2) {
    return false
  }

  // 检查是否重合
  const dx3 = point3.x - point1.x
  const dy3 = point3.y - point1.y

  // 检查向量比例
  return dx1 * dy3 === dy1 * dx3
}

/**
 * @description: 求2个点之间的距离
 * @param {IPoint} pointA 点A
 * @param {IPoint} pointB 点B
 * @return {*}
 */
export const distance = (pointA: IPoint, pointB: IPoint) => {
  return Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2)
}

/**
 * @description: 获取线段平行移动d后的端点坐标, d>0表示线段右移
 * @param {IPoint} point1 点1
 * @param {IPoint} point2 点2
 * @param {number} d 平移距离
 * @return {*}
 */
const getParallelLine = (point1: IPoint, point2: IPoint, d: number) => {
  // 计算原线段的方向向量 (dx, dy)
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  // 计算法向量 (nx, ny)
  const nx = -dy
  const ny = dx
  // 归一化法向量 (单位化)
  const nLength = Math.sqrt(nx * nx + ny * ny)
  const unitNx = nx / nLength
  const unitNy = ny / nLength
  // 平移后的新直线两个端点
  const np1 = {
    x: point1.x - d * unitNx,
    y: point1.y - d * unitNy,
  }
  const np2 = {
    x: point2.x - d * unitNx,
    y: point2.y - d * unitNy,
  }
  return { p1: np1, p2: np2 }
}

/**
 * @description: 已知AB点坐标, AC长L, 求C点坐标
 * @param {IPoint} pointA 点A
 * @param {IPoint} pointB 点B
 * @param {number} L 线段AC的长度
 * @return {*}
 */
export const calculatePointC = (pointA: IPoint, pointB: IPoint, L: number): IPoint => {
  // pointA: [x1, y1], pointB: [x2, y2]
  const x1 = pointA.x
  const y1 = pointA.y
  const x2 = pointB.x
  const y2 = pointB.y
  // 计算向量AB
  const ABx = x2 - x1
  const ABy = y2 - y1
  // 计算AB与X轴的夹角theta
  const theta = Math.atan2(ABy, ABx)
  // 使用极坐标转换到直角坐标系来计算C点
  const Cx = x1 + L * Math.cos(theta)
  const Cy = y1 + L * Math.sin(theta)
  return {
    x: Cx,
    y: Cy,
  }
}

/**
 * @description: 求直线与圆的交点, 交点可能在线段上可能不在
 * @param {IPoint} pointA 点A
 * @param {IPoint} pointB 点B
 * @param {number} L 线段AC的长度
 * @return {*}
 */
const getLineCircleIntersections = (line: ILine, circle: ICircle) => {
  // 将线段表示为参数方程：
  // x = x1 + t(x2-x1)
  // y = y1 + t(y2-y1)
  const dx = line.p2.x - line.p1.x
  const dy = line.p2.y - line.p1.y
  // 圆的方程：(x-h)² + (y-k)² = r²
  const h = circle.x
  const k = circle.y
  const r = circle.radius
  // 代入参数方程到圆方程得到关于t的二次方程：
  const a = dx * dx + dy * dy
  const b = 2 * (dx * (line.p1.x - h) + dy * (line.p1.y - k))
  const c = (line.p1.x - h) * (line.p1.x - h) + (line.p1.y - k) * (line.p1.y - k) - r * r
  const discriminant = b * b - 4 * a * c
  if (discriminant < 0) {
    return [] // 无交点
  }
  // 计算t值
  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a)
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a)
  const intersections = []
  // 当 t1 和 t2 相等时，只有一个交点
  if (t1 === t2) {
    intersections.push({ x: line.p1.x + t1 * dx, y: line.p1.y + t1 * dy })
  } else {
    intersections.push({ x: line.p1.x + t1 * dx, y: line.p1.y + t1 * dy })
    intersections.push({ x: line.p1.x + t2 * dx, y: line.p1.y + t2 * dy })
  }
  return intersections
}

/**
 * @description: 求经过圆弧起点的切线 与 经过圆弧中点、圆心的直线的交点
 * @param {IPoint} arcStart 圆弧起点
 * @param {IPoint} arcCenter 圆弧中心
 * @param {IPoint} arcEnd 圆弧终点
 * @return {*}
 */
const calculateTangentArcMinddleIntersection = (
  arcStart: IPoint,
  arcCenter: IPoint,
  arcEnd: IPoint,
) => {
  const radius = Math.sqrt(
    Math.pow(arcEnd.x - arcCenter.x, 2) + Math.pow(arcEnd.y - arcCenter.y, 2),
  )
  const middleArcPoint = calculateArcLengthAndMidPoint(arcStart, arcEnd, arcCenter)
  // 求圆弧的夹角, Canvas坐标系
  const startAngle = Math.atan2(arcCenter.y - arcStart.y, arcStart.x - arcCenter.x)
  let endAngle = Math.atan2(arcCenter.y - arcEnd.y, arcEnd.x - arcCenter.x)
  if (arcCenter.counterClockwise) {
    if (endAngle <= startAngle) {
      endAngle += 2 * Math.PI
    }
  } else {
    if (endAngle >= startAngle) {
      endAngle -= 2 * Math.PI
    }
  }
  const angle = endAngle - startAngle
  const length = radius / Math.cos(angle / 2) // TODO cos函数可能返回0
  const pointC = calculatePointC(arcCenter, middleArcPoint, length)
  return pointC
}

/**
 * @description: 弧长的2个端点和圆心, 计算弧的中点
 * @param {IPoint} pointA 弧起点
 * @param {IPoint} pointB 弧终点
 * @param {IPoint} center 圆心
 * @return {*}
 */
export const calculateArcLengthAndMidPoint = (pointA: IPoint, pointB: IPoint, center: IPoint) => {
  // 计算半径 r (圆心到任意端点的距离)
  const r = distance(center, pointA)

  // 计算向量 CA 和 CB
  const vectorCA = { x: pointA.x - center.x, y: pointA.y - center.y }
  const vectorCB = { x: pointB.x - center.x, y: pointB.y - center.y }

  // 计算点积
  const dot = dotProduct(vectorCA, vectorCB)

  // 计算向量的模
  const magnitudeCA = r // 因为 pointA 到 center 的距离是半径 r
  const magnitudeCB = r // 因为 pointB 到 center 的距离是半径 r

  // 计算 cos(θ)
  const cosTheta = dot / (magnitudeCA * magnitudeCB)

  // 由于浮动误差，确保 cos(θ) 在 [-1, 1] 范围内
  const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta)))

  // 计算弧长 L
  const arcLength = r * theta

  // 判断方向：计算 CA 和 CB 的叉积
  const cross = crossProduct(vectorCA, vectorCB)

  // 计算弧中间的角度 (θ/2)
  const halfTheta = (cross >= 0 ? 1 : -1) * (theta / 2)

  // 计算弧中间点的坐标，通过将点 pointA 绕点 center 旋转 halfTheta 得到
  const dx = vectorCA.x * Math.cos(halfTheta) - vectorCA.y * Math.sin(halfTheta)
  const dy = vectorCA.x * Math.sin(halfTheta) + vectorCA.y * Math.cos(halfTheta)
  const midPoint = { x: center.x + dx, y: center.y + dy }

  return midPoint
}

/**
 * @description: 点积
 * @param {IPoint} pointA 点A
 * @param {IPoint} pointB 点B
 * @return {*}
 */
const dotProduct = (pointA: IPoint, pointB: IPoint) => {
  return pointA.x * pointB.x + pointA.y * pointB.y
}

/**
 * @description: 计算叉积
 * @param {IPoint} pointA 点A
 * @param {IPoint} pointB 点B
 * @return {*}
 */
const crossProduct = (pointA: IPoint, pointB: IPoint) => {
  return pointA.x * pointB.y - pointA.y * pointB.x
}

/**
 * @description: 给定圆弧的起点坐标、终点坐标、圆弧夹角弧度制(canvas顺时针方向), 求圆心坐标
 * @param {IPoint} start 开始点
 * @param {IPoint} end 结束点
 * @param {number} angle 角度
 * @return {*}
 */
export const calculateArcCircleCenter = (start: IPoint, end: IPoint, angle: number) => {
  // 计算A和B之间的距离,即弦长
  const chordLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
  // 计算半径
  const radius = chordLength / (2 * Math.sin(angle / 2))
  // 计算中点M
  const Mx = (start.x + end.x) / 2
  const My = (start.y + end.y) / 2
  // 计算AB的方向向量
  const dx = end.x - start.x
  const dy = end.y - start.y
  // 计算圆心到中点的距离 h, 即弦高
  const h = Math.sqrt(radius * radius - (chordLength / 2) * (chordLength / 2))
  // 计算单位法向量
  const length = Math.sqrt(dx * dx + dy * dy)
  const unitNormalX = -dy / length // 法向量的x分量
  const unitNormalY = dx / length // 法向量的y分量
  // 计算圆心O的坐标
  const Ox = Mx + unitNormalX * h
  const Oy = My + unitNormalY * h
  return { x: Ox, y: Oy, center: true, counterClockwise: false }
}

/**
 * @description: 计算起始角和结束角 point2是不是圆周上的任意一点（除了point1和point3）就行了
 * @param {IPoint} point1 起点
 * @param {IPoint} point2 中间点
 * @param {IPoint} point3 终点
 * @return {*}
 */
export const calculateAngles = (point1: IPoint, point2: IPoint, point3: IPoint) => {
  // 计算圆心和半径
  const dx1 = point2.x - point1.x
  const dy1 = point2.y - point1.y
  const dx2 = point3.x - point2.x
  const dy2 = point3.y - point2.y

  const z1 = dx1 * (point1.x + point2.x) + dy1 * (point1.y + point2.y)
  const z2 = dx2 * (point2.x + point3.x) + dy2 * (point2.y + point3.y)
  const d = 2 * (dx1 * (point3.y - point1.y) - dy1 * (point3.x - point1.x))

  const centerX = (dy2 * z1 - dy1 * z2) / d
  const centerY = (dx1 * z2 - dx2 * z1) / d

  const radius = Math.sqrt((centerX - point1.x) ** 2 + (centerY - point1.y) ** 2)
  // 起始角和结束角
  const startAngle = Math.atan2(point1.y - centerY, point1.x - centerX)
  const endAngle = Math.atan2(point3.y - centerY, point3.x - centerX)
  return { centerX, centerY, radius, startAngle, endAngle }
}

/**
 * @description: 判断方向：逆时针为 true，顺时针为 false
 * @param {IPoint} pointA 点A
 * @param {IPoint} pointB 点B
 * @param {IPoint} center 圆心
 * @return {*}
 */
export const isCounterClockwise = (pointA: IPoint, pointB: IPoint, center: IPoint) => {
  const startAngle = calculateAngle(center, pointA)
  const endAngle = calculateAngle(center, pointB)

  // 计算角度差
  let angleDiff = endAngle - startAngle

  // 将角度差标准化到 [0, 2π] 范围
  if (angleDiff < 0) angleDiff += 2 * Math.PI

  // 判断方向
  return angleDiff <= Math.PI
}

/**
 * @description: 几何计算方法
 * @param {IPoint} center 圆心
 * @param {IPoint} pointA 任意一点
 * @return {*}
 */
const calculateAngle = (center: IPoint, pointA: IPoint) => {
  return Math.atan2(pointA.y - center.y, pointA.x - center.x)
}

/**
 * @description: 计算圆弧半径
 * @param {IPoint} center 圆心
 * @param {IPoint} point 任意一点
 * @return {*}
 */
export const calculateRadius = (center: IPoint, point: IPoint) => {
  return Math.sqrt(Math.pow(center.x - point.x, 2) + Math.pow(center.y - point.y, 2))
}

/**
 * @description: 计算起点终点
 * @param {IPoint} p1 点位1
 * @param {IPoint} p2 点位2
 * @param {IPoint} curp1 当前点1
 * @param {IPoint} curp2 当前点2
 * @return {*}
 */
export const calEndPoint = (p1: IPoint, p2: IPoint, curp1: IPoint, curp2: IPoint) => {
  const minX = Math.min(p1.x, p2.x, curp1.x, curp2.x)
  const maxX = Math.max(p1.x, p2.x, curp1.x, curp2.x)
  const minY = Math.min(p1.y, p2.y, curp1.y, curp2.y)
  const maxY = Math.max(p1.y, p2.y, curp1.y, curp2.y)
  const points = []
  points.push({
    x: minX,
    y: minY,
  })
  points.push({
    x: minX,
    y: maxY,
  })
  points.push({
    x: maxX,
    y: minY,
  })
  points.push({
    x: maxX,
    y: maxY,
  })

  const map = new Map()
  for (const point of points) {
    if (point.x === p1.x && point.y === p1.y) {
      map.set(point.x + ',' + point.y, point)
    } else if (point.x === p2.x && point.y === p2.y) {
      map.set(point.x + ',' + point.y, point)
    } else if (point.x === curp1.x && point.y === curp1.y) {
      map.set(point.x + ',' + point.y, point)
    } else if (point.x === curp2.x && point.y === curp2.y) {
      map.set(point.x + ',' + point.y, point)
    }
  }

  const newP = []
  for (const v of map.values()) {
    newP.push(v)
  }

  return newP
}

const conPointEvent = {
  dragstart: function (e) {
    this.startX = e.target.x()
    this.startY = e.target.y()
  },
  dragend: function (e) {
    const x = e.target.x() - this.startX
    const y = e.target.y() - this.startY

    console.log('打印this')
    console.log(this.index)
    console.log()

    const leftRightShape = getRectLeftRight(this)
    const leftShape = leftRightShape[0]
    const rightShape = leftRightShape[1]
    // const rightShape = this.parent.parent.children[this.parent.index - 1].children[this.index];
    // const leftShape = FunctionUtils.getAdjacentShape(rightShape)[0];
    // const leftShape = FunctionUtils.getRectShape(this);
    // const rightShape =

    move(leftShape, x, y)
    move(rightShape, x, y)

    // EventHandler.Utils.move(this.attrs.leftShape, x, y);
    // EventHandler.Utils.move(this.attrs.rightShape, x, y);
  },
}

export const createConDragRectGroup = (draggedShapeGroup: Konva.Group) => {
  const conRectGroup = new Konva.Group()

  // 连接点矩形
  for (let i = 0; i < draggedShapeGroup.children.length; i++) {
    const shape = draggedShapeGroup.children[i]
    const leftShape =
      draggedShapeGroup.children[i === 0 ? draggedShapeGroup.children.length - 1 : i - 1]
    const rightShape = shape
    const leftKind = getShapeKind(leftShape)
    const rightKind = getShapeKind(rightShape)
    let event = null
    let visible

    if (
      leftShape.attrs.sides[0].p2 === rightShape.attrs.sides[0].p1 &&
      (leftKind === 1 || leftKind === 2) &&
      (rightKind === 1 || rightKind === 2)
    ) {
      event = conPointEvent
      visible = true
    } else {
      visible = false
    }
    const side0 = shape.attrs.sides[0]
    const rect = createKonvaRect(side0.p1, event)
    rect.visible(visible)
    // rect.attrs.leftShape = leftShape;
    // rect.attrs.rightShape = rightShape;
    conRectGroup.add(rect)
  }
  conRectGroup.attrs.type = 40101
  return conRectGroup
}

// 图形方向：1 水平 2 垂直 3 倾斜 4 弧形 0 其他
const getShapeKind = (shape: Konva.Group | Konva.Shape) => {
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

const createKonvaRect = (point, event) => {
  const rect = new Konva.Rect({
    x: point.x - 30, // 矩形左上角的x坐标
    y: point.y - 30, // 矩形左上角的y坐标
    width: 60, // 矩形的宽度
    height: 60, // 矩形的高度
    fill: 'red', // 矩形的填充颜色
    stroke: 'black', // 矩形的边框颜色
    strokeWidth: 4, // 矩形的边框宽度
    draggable: true,
  })
  addEvent([rect], event)
  return rect
}

export const addEvent = (shapes, event) => {
  for (const key in event) {
    if (event.hasOwnProperty(key)) {
      // 确保是对象自有属性
      console.log(key + ': ' + event[key])
      for (const shape of shapes) {
        shape.attrs.event = event
        shape.on(key, eval(event[key]))
        shape.visible(true)
      }
    }
  }
}

const getRectShape = (rect) => {
  return rect.parent.parent.children[rect.parent.index - 2].children[rect.index]
}

function midpoint2D(pointA, pointB) {
  // pointA 和 pointB 是对象，形式为 {x: number, y: number}
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
  }
}

const calcNewPoint = (P, A, B) => {
  const midPoint = midpoint2D(A, B)
  let P2, point1, point2
  if (A.x === B.x) {
    // 垂直
    P2 = {
      x: P.x,
      y: P.y + 10,
    }
    point1 = {
      x: midPoint.x + 10000,
      y: midPoint.y,
    }
    point2 = {
      x: midPoint.x - 10000,
      y: midPoint.y,
    }
  } else if (A.y === B.y) {
    // 水平
    P2 = {
      x: P.x + 10,
      y: P.y,
    }
    point1 = {
      x: midPoint.x,
      y: midPoint.y + 10000,
    }
    point2 = {
      x: midPoint.x,
      y: midPoint.y - 10000,
    }
  } else {
    // 倾斜
    const k = (B.y - A.y) / (B.x - A.x)
    const k2 = -1 / k

    P2 = {
      x: P.x + 10,
      y: P.y + 10 * k,
    }
    point1 = {
      x: midPoint.x + 10000,
      y: midPoint.y + 10000 * k2,
    }
    point2 = {
      x: midPoint.x - 10000,
      y: midPoint.y - 10000 * k2,
    }
  }
  return getLineLineIntersection(P, P2, point1, point2)[0]
}

// 中间点拖动事件:弯曲
const midPointDragEnd = {
  dragstart: function (e) {
    this.startX = e.target.x()
    this.startY = e.target.y()
  },
  dragend: function (e) {
    // 还需要重新计算点
    // const shape = this.attrs.shape;
    const shape = getRectShape(this)
    console.log('中间点拖动')
    console.log(shape)

    const P = {
      x: e.target.x(),
      y: e.target.y(),
    } // 按鼠标位置可能更合适
    const newMidPoint = calcNewPoint(P, shape.attrs.sides[0].p1, shape.attrs.sides[0].p2)
    const param = calculateAngles(shape.attrs.sides[0].p1, newMidPoint, shape.attrs.sides[0].p2)

    if (shape.attrs.sides[0].centerPoint) {
      shape.attrs.sides[0].updateCenterPoint({ x: param.centerX, y: param.centerY })
    } else {
      shape.attrs.sides[0].centerPoint = {
        x: param.centerX,
        y: param.centerY,
      }
      shape.attrs.sides[0].centerPoint.center = true
      // 下面这行不可缺少，不知道为什么
      shape.attrs.sides[0].ang = shape.attrs.sides[0].calcCenterAng()
      shape.attrs.sides[2].centerPoint = shape.attrs.sides[0].centerPoint
      for (const side of shape.attrs.sides[2].line.sideSet) {
        side.centerPoint = shape.attrs.sides[2].centerPoint
      }
    }

    // TODO 此处计算圆心有问题
    // EventHandler.Utils.calcPoint(shape)
    // 内圈点和连接处都要重新计算下
  },
}

export const createMidDragRectGroup = (draggedShapeGroup: Konva.Group) => {
  const midRectGroup = new Konva.Group()

  // 连接点矩形
  for (let i = 0; i < draggedShapeGroup.children.length; i++) {
    const shape = draggedShapeGroup.children[i]
    const side0 = shape.attrs.sides[0]
    let event
    let visible
    if (side0.centerPoint) {
      event = midPointDragEnd
      visible = true
    } else {
      event = null
      visible = false
    }
    const rect = createKonvaRect(side0.calcMidPoint(), event)
    rect.visible(visible)
    // rect.attrs.shape = shape;
    midRectGroup.add(rect)
  }
  midRectGroup.attrs.type = 40201
  return midRectGroup
}

// 得到矩形对应的左右图形：适用连接点矩形
export const getRectLeftRight = (rect) => {
  const rightShape = rect.parent.parent.children[rect.parent.index - 1].children[rect.index]
  const leftShape = getAdjacentShape(rightShape)[0]
  return [leftShape, rightShape]
}

// 获取所有邻接图形
export const getAdjacentShape = (shape) => {
  const group = shape.parent
  const shapes = group.children
  let seq
  for (let i = 0; i < shapes.length; i++) {
    if (shapes[i] === shape) {
      seq = i
      break
    }
  }

  let left = seq - 1 < 0 ? shapes[shapes.length - 1] : shapes[seq - 1]
  let right = shapes[(seq + 1) % shapes.length]

  // 处理非闭合边框的情况
  left = shape.attrs.sides[0].p1 === left.attrs.sides[0].p2 ? left : null
  right = shape.attrs.sides[0].p2 === right.attrs.sides[0].p1 ? right : null

  return [left, right]
}
