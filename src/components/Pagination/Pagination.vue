<script lang="ts" setup>
import { defineExpose, reactive, ref } from 'vue'

const props = defineProps(['total', 'style', 'sizes', 'pageSize'])
const emit = defineEmits(['pagination'])

const currentPage = ref<number>(1)
const pageSize = ref<number>(props.pageSize || 10)
const sizes = ref<number[]>(props.sizes || [10, 20, 30, 50])

// 修改每页显示数量
function changeSize(val: number) {
  currentPage.value = 1
  pageSize.value = val
  emit('pagination', { currentPage: currentPage.value, size: pageSize.value })
}
// 页码切换
function changePage(val: number) {
  currentPage.value = val
  emit('pagination', { currentPage: currentPage.value, size: pageSize.value })
}
function refresh() {
  emit('pagination', { currentPage: currentPage.value, size: pageSize.value })
}

// 暴露给父组件的方法和变量
const exposeFunctions = {
  changeSize,
  changePage,
  refresh,
  currentPage,
  pageSize,
}
defineExpose(exposeFunctions)
</script>

<template>
  <div :style="{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', ...style }">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :hide-on-single-page="false"
      :page-sizes="sizes"
      layout="total, sizes, prev, pager, next, jumper"
      size="small"
      :total="total"
      @size-change="changeSize"
      @current-change="changePage"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
