import Konva from 'konva'

export default class ShapeClass {
  shape: Konva.Shape

  constructor(config: Konva.ShapeConfig) {
    this.shape = new Konva.Shape(config)
  }
}
