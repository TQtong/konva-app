import Konva from 'konva'

export default class BaseClass {
  public layer: Konva.Layer
  public stage: Konva.Stage

  public container: HTMLDivElement
  public width: number
  public height: number

  constructor(container: HTMLDivElement) {
    this.container = container
    this.width = container.offsetWidth
    this.height = container.offsetHeight

    this.stage = new Konva.Stage({
      container,
      width: this.width,
      height: this.height,
    })

    this.layer = new Konva.Layer()

    this.stage.add(this.layer)
  }
}
