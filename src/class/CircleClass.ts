import Konva from 'konva'

export default class CircleClass {
  circle: Konva.Circle

  constructor(config: Konva.CircleConfig | undefined = undefined) {
    this.circle = new Konva.Circle(config)
  }

  public mouseover() {
    this.circle.on('mouseover', () => {
      document.body.style.cursor = 'pointer'
      this.circle.strokeWidth(4)
    })
  }

  public mouseout() {
    this.circle.on('mouseout', () => {
      document.body.style.cursor = 'default'
      this.circle.strokeWidth(2)
    })
  }

  public dragmove(callback = () => {}) {
    this.circle.on('dragmove', () => {
      callback()
    })
  }
}
