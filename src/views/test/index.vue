<script lang="ts" setup>
import SearchBar from '@/components/SearchBar/index.vue'
import { reactive } from 'vue'

const searchConfig = [
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
  },
  {
    label: '性别',
    prop: 'sex',
    type: 'select',
    options: [
      {
        label: '男',
        value: '1',
      },
      {
        label: '女',
        value: '0',
      },
    ],
  },
] as const
type SearchFrom = Record<(typeof searchConfig)[number]['prop'], string>
const searchFrom = reactive<Partial<SearchFrom>>({})
</script>

<template>
  <div class="page-test">
    <div>
      <h3>搜索栏</h3>
      <SearchBar v-model="searchFrom" :search-config="searchConfig" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-test{
  padding: 0 20px;
}
</style>
