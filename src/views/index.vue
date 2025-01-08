<template>
  <div id="main">
    <AsideComponent @click="handleClick" />
    <div class="konva-container" ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import Konva from 'konva'

import AsideComponent from './components/aside/index.vue'

import BaseClass from '@/class/BaseClass'

import { PolygonClass } from '@/class/Polygon'
import CommonData from '@/class/CommonData'

const container = useTemplateRef<HTMLDivElement>('container')
const parent = new Konva.Group()
const handleClick = (type: string) => {
  switch (type) {
    case 'square':
      // createRect()
      const mouseX = 400
      const mouseY = 400
      const p1 = {
        x: mouseX,
        y: mouseY - 200,
      }

      const p2 = {
        x: mouseX + 200,
        y: mouseY + 200,
      }

      const p3 = {
        x: mouseX - 200,
        y: mouseY + 200,
      }

      const outerPoints = [p1, p2, p3, p1]

      const polygonClass = new PolygonClass()
      const group = polygonClass.createKonvaGroups(outerPoints)
      parent.add(...group)

      window.baseClass.layer.add(parent)
      CommonData.layer = new Konva.Layer()
      CommonData.layer.add(parent)

      window.baseClass.stage.add(CommonData.layer)
      CommonData.layer.attrs.frameWidth = 60 // 外框宽度
      CommonData.layer.attrs.centrePostWidth = 80 // 中梃宽度
      CommonData.layer.attrs.gasketWidth = 20 // 胶条宽度

      break
    case '2':
      console.log('2')
      break
    case '3':
      console.log('3')
      break
    default:
      break
  }
}

onMounted(() => {
  window.baseClass = new BaseClass(container.value as HTMLDivElement)
})
</script>

<style scoped lang="scss">
@import url(./style.scss);
</style>
