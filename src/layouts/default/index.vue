<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main><RouterView /></el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped lang="scss">
@import url(./style.scss);
</style>
