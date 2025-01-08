<template>
  <div id="main">
    <AsideComponent @click="handleClick" />
    <div class="konva-container" ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

import AsideComponent from './components/aside/index.vue'

import BaseClass from '@/class/BaseClass'

import { PolygonClass } from '@/class/Polygon'

const container = useTemplateRef<HTMLDivElement>('container')
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

      window.baseClass.layer.add(...group)

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
