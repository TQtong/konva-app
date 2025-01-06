<template>
  <RouterView />
  <!-- <div id="test" ref="container"></div> -->
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, useTemplateRef } from 'vue'
import BaseClass from './class/BaseClass'
import CircleClass from './class/CircleClass'
import ShapeClass from './class/ShapeClass'
import LineClass from './class/LineClass'

const container = useTemplateRef<HTMLDivElement>('container')

// onMounted(() => {
//   const { layer } = new BaseClass(container.value as HTMLDivElement)

//   // we will use custom shape for curve
//   const quadraticLine = new ShapeClass({
//     stroke: 'red',
//     strokeWidth: 4,
//     sceneFunc: (ctx, shape) => {
//       ctx.beginPath()
//       ctx.moveTo(quad.start.circle.x(), quad.start.circle.y())
//       ctx.quadraticCurveTo(
//         quad.control.circle.x(),
//         quad.control.circle.y(),
//         quad.end.circle.x(),
//         quad.end.circle.y(),
//       )
//       ctx.fillStrokeShape(shape)
//     },
//   })
//   layer.add(quadraticLine.shape)

//   // we will use custom shape for curve
//   const bezierLine = new ShapeClass({
//     stroke: 'blue',
//     strokeWidth: 5,
//     sceneFunc: (ctx, shape) => {
//       ctx.beginPath()
//       ctx.moveTo(bezier.start.circle.x(), bezier.start.circle.y())
//       ctx.bezierCurveTo(
//         bezier.control1.circle.x(),
//         bezier.control1.circle.y(),
//         bezier.control2.circle.x(),
//         bezier.control2.circle.y(),
//         bezier.end.circle.x(),
//         bezier.end.circle.y(),
//       )
//       ctx.fillStrokeShape(shape)
//     },
//   })
//   layer.add(bezierLine.shape)

//   const quadLinePath = new LineClass({
//     dash: [10, 10, 0, 10],
//     strokeWidth: 3,
//     stroke: 'black',
//     lineCap: 'round',
//     id: 'quadLinePath',
//     opacity: 0.3,
//     points: [0, 0],
//   })
//   layer.add(quadLinePath.line)

//   const bezierLinePath = new LineClass({
//     dash: [10, 10, 0, 10],
//     strokeWidth: 3,
//     stroke: 'black',
//     lineCap: 'round',
//     id: 'bezierLinePath',
//     opacity: 0.3,
//     points: [0, 0],
//   })
//   layer.add(bezierLinePath.line)

//   const quad = {
//     start: new CircleClass({
//       x: 60,
//       y: 30,
//       radius: 20,
//       stroke: '#666',
//       fill: '#ddd',
//       strokeWidth: 2,
//       draggable: true,
//     }),
//     control: new CircleClass({
//       x: 240,
//       y: 110,
//       radius: 20,
//       stroke: '#666',
//       fill: '#ddd',
//       strokeWidth: 2,
//       draggable: true,
//     }),
//     end: new CircleClass({
//       x: 80,
//       y: 160,
//       radius: 20,
//       stroke: '#666',
//       fill: '#ddd',
//       strokeWidth: 2,
//       draggable: true,
//     }),
//   }

//   const bezier = {
//     start: new CircleClass({
//       x: 280,
//       y: 20,
//       radius: 20,
//       stroke: '#666',
//       fill: '#ddd',
//       strokeWidth: 2,
//       draggable: true,
//     }),
//     control1: new CircleClass({
//       x: 530,
//       y: 40,
//       radius: 20,
//       stroke: '#666',
//       fill: '#ddd',
//       strokeWidth: 2,
//       draggable: true,
//     }),
//     control2: new CircleClass({
//       x: 480,
//       y: 150,
//       radius: 20,
//       stroke: '#666',
//       fill: '#ddd',
//       strokeWidth: 2,
//       draggable: true,
//     }),
//     end: new CircleClass({
//       x: 300,
//       y: 150,
//       radius: 20,
//       stroke: '#666',
//       fill: '#ddd',
//       strokeWidth: 2,
//       draggable: true,
//     }),
//   }

//   layer.add(quad.start.circle)
//   layer.add(quad.control.circle)
//   layer.add(quad.end.circle)
//   layer.add(bezier.start.circle)
//   layer.add(bezier.control1.circle)
//   layer.add(bezier.control2.circle)
//   layer.add(bezier.end.circle)

//   const q = quad
//   const b = bezier

//   // function to update line points from anchors
//   const updateDottedLines = () => {
//     const quadLinePath = layer.findOne('#quadLinePath')
//     const bezierLinePath = layer.findOne('#bezierLinePath')

//     if (quadLinePath && bezierLinePath) {
//       quadLinePath.points([
//         q.start.circle.x(),
//         q.start.circle.y(),
//         q.control.circle.x(),
//         q.control.circle.y(),
//         q.end.circle.x(),
//         q.end.circle.y(),
//       ])

//       bezierLinePath.points([
//         b.start.circle.x(),
//         b.start.circle.y(),
//         b.control1.circle.x(),
//         b.control1.circle.y(),
//         b.control2.circle.x(),
//         b.control2.circle.y(),
//         b.end.circle.x(),
//         b.end.circle.y(),
//       ])
//     }
//   }
//   quad.start.mouseover()
//   quad.start.mouseout()
//   quad.start.dragmove(updateDottedLines)

//   quad.control.mouseover()
//   quad.control.mouseout()
//   quad.control.dragmove(updateDottedLines)

//   quad.end.mouseover()
//   quad.end.mouseout()
//   quad.end.dragmove(updateDottedLines)

//   bezier.start.mouseover()
//   bezier.start.mouseout()
//   bezier.start.dragmove(updateDottedLines)

//   bezier.control1.mouseover()
//   bezier.control1.mouseout()
//   bezier.control1.dragmove(updateDottedLines)

//   bezier.control2.mouseover()
//   bezier.control2.mouseout()
//   bezier.control2.dragmove(updateDottedLines)

//   bezier.end.mouseover()
//   bezier.end.mouseout()
//   bezier.end.dragmove(updateDottedLines)

//   updateDottedLines()
// })
</script>

<style scoped>
#test {
  width: 100vw;
  height: 100vh;
  background-color: aqua;
}
</style>
