<script setup lang="ts">
import type { PropType } from 'vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { computed, defineProps, ref } from 'vue'

const _props = defineProps({
  // searchConfig: 表单配置数组，用于动态生成表单项
  searchConfig: {
    type: Array as PropType<SearchConfigItem[]>,
    required: true,
  },
  labelWidth: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Object as PropType<{ [key: string]: any }>,
    required: true,
  },
})
// 定义组件的属性
const emits = defineEmits(['search', 'reset', 'update:modelValue'])
const searchFormRef = ref()
const searchFrom = computed({
  get: () => _props.modelValue,
  set: value => emits('update:modelValue', value),
})

const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])

function handleSearch() {
  emits('search', searchFrom.value)
}

function handleReset() {
  searchFormRef.value?.resetFields()
  emits('reset')
}
</script>

<template>
  <div class="comp-search-bar">
    <el-form v-if="searchConfig.length > 0" ref="searchFormRef" :model="searchFrom" :inline="true">
      <el-row :gutter="20">
        <el-col v-for="(item, index) in searchConfig" :key="index" :span="item.span || 6">
          <el-form-item :label="item.label" :prop="item.prop" :label-width="labelWidth">
            <!-- 输入框 -->
            <el-input
              v-if="item.type === 'input'" v-model="searchFrom[item.prop]" :placeholder="item.placeholder || '请输入'"
              clearable
              @clear="() => { searchFrom[item.prop] = undefined }"
            />
            <!-- 选择栏 -->
            <el-select
              v-else-if="item.type === 'select'" v-model="searchFrom[item.prop]"
              :placeholder="item.placeholder || '请选择'" clearable filterable
              @clear="() => { searchFrom[item.prop] = undefined }"
            >
              <el-option
                v-for="option in item.options" :key="option.value" :label="option.label"
                :value="option.value"
              />
            </el-select>
            <!-- 时间选择 -->
            <el-date-picker
              v-else-if="item.type === 'date'" v-model="searchFrom[item.prop]" type="datetimerange"
              start-placeholder="开始时间" end-placeholder="结束时间" :default-time="defaultTime" format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div style="white-space: nowrap;margin-bottom: 18px;">
            <el-button type="primary" :icon="Search" @click="handleSearch">
              搜索
            </el-button>
            <el-button :icon="Refresh" @click="handleReset">
              重置
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-skeleton v-else style="padding-bottom: 20px">
      <template #template>
        <div style="height: 32px; display: flex; align-items: center; justify-items: space-between">
          <el-skeleton-item variant="text" style="margin-right: 16px; height: 32px; width: 200px" />
          <el-skeleton-item variant="text" style="margin-right: 16px; height: 32px; width: 200px" />
          <el-skeleton-item variant="text" style="margin-right: 16px; height: 32px; width: 200px" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.comp-search-bar {
  width: 100%;
  background: #fff;

  .left {
    flex: 1;
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 24px;
    max-width: 200px;
  }
}

.el-form-item {
  width: 100%;

  .el-form-item__content {
    width: 100%;
  }
}

.el-input,
.el-select {
  width: 100%;
}
</style>
