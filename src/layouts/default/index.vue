<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside>
        <AsideComponent />
      </el-aside>
      <el-container>
        <el-main>
          <RouterView />
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AsideComponent from './components/aside/index.vue'
</script>

<style scoped lang="scss">
@import url(./style.scss);
</style>
