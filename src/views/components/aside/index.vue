<template>
  <div id="aside">
    <el-dropdown placement="right-start">
      <span class="el-dropdown-link">
        外框
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            @click="handleClick(item.type)"
            v-for="item in itemList"
            :key="item.id"
            :icon="item.icon"
          >
            <el-icon :icon="item.icon"></el-icon>
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

import { itemList } from './composable/data'

const emits = defineEmits(['click'])

const handleClick = (type: string) => {
  emits('click', type)
}
</script>

<style scoped lang="scss">
@import url(./style.scss);
</style>
