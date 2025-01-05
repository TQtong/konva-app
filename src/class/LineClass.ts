import Konva from 'konva'

export default class LineClass {
  line: Konva.Line

  constructor(config: Konva.LineConfig) {
    this.line = new Konva.Line(config)
  }
}
