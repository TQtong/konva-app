import Konva from 'konva'

export default class RectClass {
  rect: Konva.Rect

  constructor(config: Konva.RectConfig) {
    this.rect = new Konva.Rect(config)
  }

  public addControlPoints(layer: Konva.Layer) {
    const position = {
      x: this.rect.x(),
      y: this.rect.y(),
    }
    const point = new RectClass({
      x: position.x,
      y: position.y,
      width: 10,
      height: 10,
      fill: 'red',
      draggable: true,
    })
    layer.add(point.rect)

    const position1 = {
      x: this.rect.x() + this.rect.width(),
      y: this.rect.y(),
    }
    const point1 = new RectClass({
      x: position1.x,
      y: position1.y,
      width: 10,
      height: 10,
      fill: 'red',
      draggable: true,
    })
    layer.add(point1.rect)

    const position2 = {
      x: this.rect.x() + this.rect.width(),
      y: this.rect.y() + this.rect.height(),
    }
    const point2 = new RectClass({
      x: position2.x,
      y: position2.y,
      width: 10,
      height: 10,
      fill: 'red',
      draggable: true,
    })
    layer.add(point2.rect)

    const position3 = {
      x: this.rect.x(),
      y: this.rect.y() + this.rect.height(),
    }
    const point3 = new RectClass({
      x: position3.x,
      y: position3.y,
      width: 10,
      height: 10,
      fill: 'red',
      draggable: true,
    })
    layer.add(point3.rect)

    const updateDottedLines = () => {
      const quadLinePath = layer.findOne('#rect1')
      console.log(quadLinePath.attrs)
      debugger
      if (quadLinePath) {
        quadLinePath.attrs
        quadLinePath.points([
          point.rect.x(),
          point.rect.y(),
          point1.rect.x(),
          point1.rect.y(),
          point2.rect.x(),
          point2.rect.y(),
          point3.rect.x(),
          point3.rect.y(),
        ])
      }
    }

    point.mouseover()
    point.mouseout()
    point.dragmove(updateDottedLines)
  }

  public mouseover() {
    this.rect.on('mouseover', () => {
      document.body.style.cursor = 'pointer'
      this.rect.strokeWidth(4)
    })
  }

  public mouseout() {
    this.rect.on('mouseout', () => {
      document.body.style.cursor = 'default'
      this.rect.strokeWidth(2)
    })
  }

  public dragmove(callback = () => {}) {
    this.rect.on('dragmove', () => {
      callback()
    })
  }
}
