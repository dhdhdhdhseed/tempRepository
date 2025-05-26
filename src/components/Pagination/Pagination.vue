<script lang="ts" setup>
import type { PropType } from 'vue'
import { defineExpose, ref } from 'vue'

// const props = defineProps(['total', 'style', 'sizes', 'pageSize'])
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  style: {
    type: Object,
    default: () => ({}),
  },
  sizes: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 30, 50],
  },
  pageSize: {
    type: Number as PropType<number>,
    default: 10,
  },
  propsConfig: {
    type: Object,
    default:()=>({
      size:''
    })
  },
})
const emit = defineEmits(['pagination'])

const pageNumber = ref<number>(1)
const pageSize = ref<number>(props.pageSize)
const sizes = ref<number[]>(props.sizes)

// 修改每页显示数量
function changeSize(val: number) {
  console.log('修改每页显示数量');
  
  pageNumber.value = 1
  pageSize.value = val
  emit('pagination', { pageNumber: pageNumber.value, pageSize: pageSize.value })
}
// 页码切换
function changePage(val: number) {
  pageNumber.value = val
  emit('pagination', { pageNumber: pageNumber.value, pageSize: pageSize.value })
}
function refresh() {
  emit('pagination', { pageNumber: pageNumber.value, pageSize: pageSize.value })
}

// 暴露给父组件的方法和变量
const exposeFunctions = {
  changeSize,
  changePage,
  refresh,
  pageNumber,
  pageSize,
}
defineExpose(exposeFunctions)
</script>

<template>
  <div :style="{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', ...style }">
    <el-pagination
      v-model:current-page="pageNumber"
      v-model:page-page-size="pageSize"
      :hide-on-single-page="false"
      :page-sizes="sizes"
      layout="total, sizes, prev, pager, next, jumper"
      page-size="small"
      :total="total"
      @size-change="changeSize"
      @current-change="changePage"
      :size="propsConfig.size"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
