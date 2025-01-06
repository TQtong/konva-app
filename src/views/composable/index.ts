import RectClass from '@/class/RectClass'

export const createRect = () => {
  const rectClass = new RectClass({
    x: 100,
    y: 100,
    width: 100,
    height: 50,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 5,
    id: 'rect1',
  })

  const layer = window.baseClass.layer
  layer.add(rectClass.rect)

  rectClass.addControlPoints(layer)
}
