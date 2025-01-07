// 公共数据区
export default class CommonData {
  static mouseStatus = 2 // 鼠标状态：0是指针，1开头是外框，2开头是中梃，3开头是门窗
  static layer = null // 当前图层
  static selectedObject = null // 当前选中的对象

  static windowMap = {
    // 30000 玻璃
    30000: 'new Window(this.shape).createKonvaGroup();',
    // 30101 平推纱扇
    30101: 'new ScreenWindow(this.shape).createKonvaGroup();',
    // 30102 对开纱扇
    30102: 'new ScreenWindowDouble(this.shape).createKonvaGroup();',
    // 30103 折叠纱扇
    30103: '',
    // 30201 平推玻扇
    30201: 'new GlassWindow(this.shape).createKonvaGroup();',
    // 30202 对开玻扇
    30202: 'new GlassWindowDouble(this.shape).createKonvaGroup();',
    // 30203 折叠玻扇
    30203: '',
    // 30301 防盗窗
    30301: 'new AntiTheftWindow(this.shape).createKonvaGroup();',
    // 30401 百叶窗
    30401: 'new ShuttersWindow(this.shape).createKonvaGroup();',
    // 30402 对开百叶窗
    30402: 'new ShuttersWindowDouble(this.shape).createKonvaGroup();',
  }

  static getCentrePost(code, shape, mousePos) {
    switch (code) {
      // 竖梃
      case 20101:
        return new SingleVerticalCentrePost(shape, mousePos).createKonvaGroups()
      case 20102:
        return new MultiVerticalCentrePost(shape, 2).createKonvaGroups()
      case 20103:
        return new MultiVerticalCentrePost(shape, 3).createKonvaGroups()
      // 横梃
      case 20201:
        return new SingleHorizontalCentrePost(shape, mousePos).createKonvaGroups()
      case 20202:
        return new MultiHorizontalCentrePost(shape, 2).createKonvaGroups()
      case 20203:
        return new MultiHorizontalCentrePost(shape, 3).createKonvaGroups()

      case 20301:
        // 等分分体圆弧
        return new EvenlyDividedArcCentrePost(shape, 3).createKonvaGroups()
      case 20401:
        // 二阶分体圆弧
        return new SecondOrderSegmentedArcCentrePost(shape).createKonvaGroups()
      case 20501:
        // 连体圆弧
        return new ConjoinedArcCentrePost(shape).createKonvaGroups()
    }
  }

  static getFrame(code, x, y) {
    switch (code) {
      // 10101 矩形外框
      case 10101:
        return new RectTemplate(x, y).createKonvaGroups()
      // 10201 隐藏外框
      case 10201:
        return new HideTemplate(x, y, 1).createKonvaGroups()
      // 10202 隐藏外框
      case 10202:
        return new HideTemplate(x, y, 2).createKonvaGroups()
      // 10203 隐藏外框
      case 10203:
        return new HideTemplate(x, y, 3).createKonvaGroups()
      // 10204 隐藏外框
      case 10204:
        return new HideTemplate(x, y, 4).createKonvaGroups()
      // 10301 缺边肯德基
      case 10301:
        return new KFC1Template(x, y, 1).createKonvaGroups()
      // 10302 缺边肯德基
      case 10302:
        return new KFC1Template(x, y, 2).createKonvaGroups()
      // 10401 缺边肯德基2
      case 10401:
        return new KFC2Template(x, y, 1).createKonvaGroups()
      // 10402 缺边肯德基2
      case 10402:
        return new KFC2Template(x, y, 2).createKonvaGroups()
      // 10501 肯德基门-三门
      case 10501:
        return new KFCDoor1Template(x, y).createKonvaGroups()
      // 10502 肯德基门-五门
      case 10502:
        return new KFCDoor2Template(x, y).createKonvaGroups()
      // 10601 肯德基门2
      case 10601:
        return new KFCDoorTemplateA(x, y).createKonvaGroups()
      // 10701 肯德基门4
      case 10701:
        return new KFCDoorTemplateB(x, y).createKonvaGroups()
      // 10801 八边形
      case 10801:
        return new ScalePolygonTemplate(x, y, 8).createKonvaGroups()
      // 10901 六边形
      case 10901:
        return new ScalePolygonTemplate(x, y, 6).createKonvaGroups()
      // 11001 等腰三角形
      case 11001:
        return new ScalePolygonTemplate(x, y, 3).createKonvaGroups()
      // 11101 六边形2
      case 11101:
        return new HexagonTemplate(x, y).createKonvaGroups()
      // 11201 六边形3
      case 11201:
        return new RRTemplate(x, y, 1).createKonvaGroups()
      // 11202 六边形3
      case 11202:
        return new RRTemplate(x, y, 2).createKonvaGroups()
      // 11301 菱形
      case 11301:
        return new ScalePolygonTemplate(x, y, 4).createKonvaGroups()
      // 11401 倾斜五边形
      case 11401:
        return new TiltedPentagonTemplate(x, y, 1).createKonvaGroups()
      // 11402 倾斜五边形
      case 11402:
        return new TiltedPentagonTemplate(x, y, 2).createKonvaGroups()
      // 11403 倾斜五边形
      case 11403:
        return new TiltedPentagonTemplate(x, y, 3).createKonvaGroups()
      // 11404 倾斜五边形
      case 11404:
        return new TiltedPentagonTemplate(x, y, 4).createKonvaGroups()
      // 11501 三角顶
      case 11501:
        return new TriangleTopTemplate(x, y).createKonvaGroups()
      // 11601 梯形
      case 11601:
        return new TrapezoidTemplate(x, y, 1).createKonvaGroups()
      // 11602 梯形
      case 11602:
        return new TrapezoidTemplate(x, y, 2).createKonvaGroups()
      // 11603 梯形
      case 11603:
        return new TrapezoidTemplate(x, y, 3).createKonvaGroups()
      // 11604 梯形
      case 11604:
        return new TrapezoidTemplate(x, y, 4).createKonvaGroups()
      // 11701 单耳框
      case 11701:
        return new SingleEarTemplate(x, y, 1).createKonvaGroups()
      // 11702 单耳框
      case 11702:
        return new SingleEarTemplate(x, y, 2).createKonvaGroups()
      // 11703 单耳框
      case 11703:
        return new SingleEarTemplate(x, y, 3).createKonvaGroups()
      // 11704 单耳框
      case 11704:
        return new SingleEarTemplate(x, y, 4).createKonvaGroups()
      // 11801 双耳框
      case 11801:
        return new DoubleEarTemplate(x, y, 1).createKonvaGroups()
      // 11802 双耳框
      case 11802:
        return new DoubleEarTemplate(x, y, 2).createKonvaGroups()
      // 11803 双耳框
      case 11803:
        return new DoubleEarTemplate(x, y, 3).createKonvaGroups()
      // 11804 双耳框
      case 11804:
        return new DoubleEarTemplate(x, y, 4).createKonvaGroups()
      // 11901 异形外框
      case 11901:
        return new Heterotypic(x, y, 1).createKonvaGroups()
      // 11902 异形外框
      case 11902:
        return new Heterotypic(x, y, 2).createKonvaGroups()
      // 12001 异形外框
      case 12001:
        return new HeterotypicC(x, y).createKonvaGroups()
      // 12101 矩形外框圆弧顶
      case 12101:
        return new CircularTopTemplate(x, y).createKonvaGroups()
      // 12201 半圆
      case 12201:
        return new CircleTemplate(x, y, 1).createKonvaGroups()
      // 12301 四分之一圆
      case 12301:
        return new CircleTemplate(x, y, 2).createKonvaGroups()
      // 12302 四分之一圆
      case 12302:
        return new CircleTemplate(x, y, 3).createKonvaGroups()
      // 12401 哥特式
      case 12401:
        return new GothTemplate(x, y).createKonvaGroups()
      // 12501 洋葱
      case 12501:
        return new OnionTemplate(x, y).createKonvaGroups()
      // 12601 半个洋葱
      case 12601:
        return new HalfOnionTemplate(x, y).createKonvaGroups()
      // 12602 半个洋葱
      case 12602:
        return new HalfOnionTemplate(x, y).createKonvaGroups()
      // 12701 尖耳
      case 12701:
        return new PointyEarsTemplate(x, y, 1).createKonvaGroups()
      // 12702 尖耳
      case 12702:
        return new PointyEarsTemplate(x, y, 2).createKonvaGroups()
      // 12703 尖耳
      case 12703:
        return new PointyEarsTemplate(x, y, 3).createKonvaGroups()
      // 12704 尖耳
      case 12704:
        return new PointyEarsTemplate(x, y, 4).createKonvaGroups()
      case 19901:
        // 需要外圈点参数
        // return new CustomTemplate(x, y, 4).createKonvaGroups();
        break
    }
  }

  static getWindow(code, shape) {
    switch (code) {
      // 30000 玻璃
      case 30000:
        return new Window(shape).createKonvaGroup()
      // 30101 平推纱扇
      case 30101:
        return new ScreenWindow(shape).createKonvaGroup()
      // 30102 对开纱扇
      case 30102:
        return new ScreenWindowDouble(shape).createKonvaGroup()
      // 30103 折叠纱扇
      case 30103:
        return
      // 30201 平推玻扇
      case 30201:
        return new GlassWindow(shape).createKonvaGroup()
      // 30202 对开玻扇
      case 30202:
        return new GlassWindowDouble(shape).createKonvaGroup()
      // 30203 折叠玻扇
      case 30203:
        // 30301 防盗窗
        return
      case 30301:
        return new AntiTheftWindow(shape).createKonvaGroup()
      // 30401 百叶窗(玻扇)
      case 30401:
        return new ShuttersWindow(shape).createKonvaGroup()
      // 30402 对开百叶窗(玻扇)
      case 30402:
        return new ShuttersWindowDouble(shape).createKonvaGroup()
    }
  }

  // mouseStatus字典
  // 0 指针
  // 10101 矩形外框
  // 10201 隐藏外框
  // 10202 隐藏外框
  // 10203 隐藏外框
  // 10204 隐藏外框
  // 10301 缺边肯德基
  // 10302 缺边肯德基
  // 10401 缺边肯德基2
  // 10402 缺边肯德基2
  // 10501 肯德基门-三门
  // 10501 肯德基门-五门
  // 10601 肯德基门2
  // 10701 肯德基门4
  // 10801 八边形
  // 10901 六边形
  // 11001 等腰三角形
  // 11101 六边形2
  // 11201 六边形3
  // 11202 六边形3
  // 11301 菱形
  // 11401 倾斜五边形
  // 11402 倾斜五边形
  // 11403 倾斜五边形
  // 11404 倾斜五边形
  // 11501 三角顶
  // 11601 梯形
  // 11602 梯形
  // 11603 梯形
  // 11604 梯形
  // 11701 单耳框
  // 11702 单耳框
  // 11703 单耳框
  // 11704 单耳框
  // 11801 双耳框
  // 11802 双耳框
  // 11803 双耳框
  // 11804 双耳框
  // 11901 异形外框
  // 11902 异形外框
  // 12001 异形外框
  // 12101 矩形外框圆弧顶
  // 12201 半圆
  // 12301 四分之一圆
  // 12302 四分之一圆
  // 12401 哥特式
  // 12501 洋葱
  // 12601 半个洋葱
  // 12602 半个洋葱
  // 12701 六边形3
  // 12702 六边形3

  // 20101 竖梃
  // 20102 2等分竖梃
  // 20103 3等分竖梃
  // 20201 横梃
  // 20202 2等分横梃
  // 20203 3等分横梃
  // 20301 等分分体圆弧
  // 20401 二阶分体圆弧
  // 20501 连体圆弧

  // 30101 平推纱扇
  // 30102 对开纱扇
  // 30103 折叠纱扇
  // 30201 平推玻扇
  // 30202 对开玻扇
  // 30203 折叠玻扇
  // 30301 防盗窗
}
