import CircleClass from '@/class/CircleClass'
import ShapeClass from '@/class/ShapeClass'
import LineClass from '@/class/LineClass'

export const createRect = () => {
  const layer = window.baseClass.layer

  const bezier = {
    start: new CircleClass({
      x: 280,
      y: 20,
      radius: 20,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: 2,
      draggable: true,
    }),
    control1: new CircleClass({
      x: 530,
      y: 40,
      radius: 20,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: 2,
      draggable: true,
    }),
    control2: new CircleClass({
      x: 480,
      y: 150,
      radius: 20,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: 2,
      draggable: true,
    }),
    end: new CircleClass({
      x: 300,
      y: 150,
      radius: 20,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: 2,
      draggable: true,
    }),
  }

  const bezierLinePath = new LineClass({
    dash: [10, 10, 0, 10],
    strokeWidth: 3,
    stroke: 'black',
    lineCap: 'round',
    id: 'bezierLinePath',
    opacity: 0.3,
    points: [0, 0],
  })
  layer.add(bezierLinePath.line)

  const bezierLine = new ShapeClass({
    fill: 'red',
    stroke: 'blue',
    strokeWidth: 5,
    sceneFunc: (ctx, shape) => {
      ctx.beginPath()
      ctx.moveTo(bezier.start.circle.x(), bezier.start.circle.y())
      ctx.lineTo(bezier.control1.circle.x(), bezier.control1.circle.y())
      ctx.lineTo(bezier.control2.circle.x(), bezier.control2.circle.y())
      ctx.lineTo(bezier.end.circle.x(), bezier.end.circle.y())
      ctx.lineTo(bezier.start.circle.x(), bezier.start.circle.y())
      ctx.fillStrokeShape(shape)
    },
  })
  layer.add(bezierLine.shape)
  layer.add(bezier.start.circle)
  layer.add(bezier.control1.circle)
  layer.add(bezier.control2.circle)
  layer.add(bezier.end.circle)

  // function to update line points from anchors
  const updateDottedLines = () => {
    const quadLinePath = layer.findOne('#quadLinePath')
    const bezierLinePath = layer.findOne('#bezierLinePath')

    if (quadLinePath && bezierLinePath) {
      bezierLinePath.points([
        bezier.start.circle.x(),
        bezier.start.circle.y(),
        bezier.control1.circle.x(),
        bezier.control1.circle.y(),
        bezier.control2.circle.x(),
        bezier.control2.circle.y(),
        bezier.end.circle.x(),
        bezier.end.circle.y(),
      ])
    }
  }

  bezier.start.mouseover()
  bezier.start.mouseout()
  bezier.start.dragmove(updateDottedLines)

  bezier.control1.mouseover()
  bezier.control1.mouseout()
  bezier.control1.dragmove(updateDottedLines)

  bezier.control2.mouseover()
  bezier.control2.mouseout()
  bezier.control2.dragmove(updateDottedLines)

  bezier.end.mouseover()
  bezier.end.mouseout()
  bezier.end.dragmove(updateDottedLines)
}
