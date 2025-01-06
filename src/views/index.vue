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

import { createRect } from './composable/index'

const container = useTemplateRef<HTMLDivElement>('container')

const handleClick = (type: string) => {
  switch (type) {
    case 'square':
      createRect()
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
