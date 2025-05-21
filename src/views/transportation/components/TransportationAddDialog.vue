<script lang="ts" setup>
import type {
  ConsoleTmsServiceInfoListDataItem,
  ConsoleTransportationModeDataItem,
} from '@/api/manage/types/console'
import type { PropType } from 'vue'
import {
  consoleTransportationModeNew,
  consoleTransportationModeUpdate,
} from '@/api/manage'
import { ElMessage } from 'element-plus'
import { defineExpose, reactive, ref } from 'vue'

const props = defineProps({
  dialogData: {
    type: Object as PropType<ConsoleTransportationModeDataItem>,
    required: true,
  },
  enum2Data: {
    type: Object,
    required: true,
  },
  enum3Data: {
    type: Object,
    required: true,
  },
  enum4Data: {
    type: Object,
    required: true,
  },
  enum5Data: {
    type: Object,
    required: true,
  },
  serviceList: {
    type: Array as PropType<ConsoleTmsServiceInfoListDataItem[]>,
    required: true,
  },
})
const emits = defineEmits(['dialogConfirm'])
const visible = ref(false)
const loading = ref(false)

const ruleFormRef = ref()
interface FormData {
  serviceCode: string
  awsTransportMode: string
  serviceLevel: string
  lastLegDeliveryMode: string
  countryCode: string
  minTransitDays: string
  maxTransitDays: string
  id: string
}
const ruleForm = reactive<FormData>({
  id: '',
  serviceCode: '',
  awsTransportMode: '',
  serviceLevel: '',
  lastLegDeliveryMode: '',
  countryCode: '',
  minTransitDays: '',
  maxTransitDays: '',
})
const rules = {
  serviceCode: { required: true, message: '请选择运输服务', trigger: 'blur' },
  awsTransportMode: {
    required: true,
    message: '请选择头程运输方式',
    trigger: 'blur',
  },
  lastLegDeliveryMode: {
    required: true,
    message: '请选择尾程运输方式',
    trigger: 'blur',
  },
  serviceLevel: { required: true, message: '请选择服务级别', trigger: 'blur' },
  countryCode: { required: true, message: '请选择国家', trigger: 'blur' },
  minTransitDays: {
    required: true,
    message: '请输入最小运输天数',
    trigger: 'blur',
  },
  maxTransitDays: {
    required: true,
    message: '请输入最大运输天数',
    trigger: 'blur',
  },
}

function handleSubmit() {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const api = ruleForm.id
        ? consoleTransportationModeUpdate
        : consoleTransportationModeNew
      const result = await api(ruleForm)
      if (result.code === '000000') {
        ElMessage.success('操作成功')
        visible.value = false
        emits('dialogConfirm')
      }
    }
  })
}

const showServiceList = ref<ConsoleTmsServiceInfoListDataItem[]>([])
function filterService(query: string) {
  query = query.toLowerCase()
  showServiceList.value = props.serviceList.filter(
    (item: { code: string, name: string }) =>
      item.code.toLowerCase().includes(query)
      || item.name.toLowerCase().includes(query),
  )
}
function handleClose() {
  ruleFormRef.value.resetFields()
}

function onEnter() {
  showServiceList.value = props.serviceList
  if (props.dialogData?.id) {
    const mergedObj: Record<string, any> = Object.keys(ruleForm).reduce(
      (acc, key) => {
        if (props.dialogData && key in props.dialogData) {
          acc[key]
            = props.dialogData[key as keyof ConsoleTransportationModeDataItem]
              ?? ruleForm[key as keyof typeof ruleForm]
        }
        else {
          acc[key] = ruleForm[key as keyof typeof ruleForm]
        }
        return acc
      },
      {} as Record<string, any>,
    )
    Object.assign(ruleForm, mergedObj)
  }
}

defineExpose({
  visible,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="dialogData?.id ? '运输方式编辑' : '运输方式添加'"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    :destroy-on-close="true"
    :append-to-body="true"
    @open="onEnter"
    @close="handleClose"
  >
    <div class="FD-dialog-body">
      <el-form
        ref="ruleFormRef"
        :inline="false"
        :model="ruleForm"
        :rules="rules"
        label-width="10em"
      >
        <el-form-item prop="serviceCode" label="运输服务">
          <el-select
            v-model="ruleForm.serviceCode"
            filterable
            :filter-method="filterService"
            placeholder="输入服务代码或服务名称进行筛选"
          >
            <el-option
              v-for="item in showServiceList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="serviceLevel" label="服务级别">
          <el-select
            v-model="ruleForm.serviceLevel"
            placeholder="请选择服务级别"
          >
            <el-option
              v-for="option in enum3Data.enmuOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="awsTransportMode" label="头程运输方式">
          <el-select
            v-model="ruleForm.awsTransportMode"
            placeholder="请选择头程运输方式"
          >
            <el-option
              v-for="option in enum2Data.enmuOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="lastLegDeliveryMode" label="尾程运输方式">
          <el-select
            v-model="ruleForm.lastLegDeliveryMode"
            placeholder="请选择尾程运输方式"
          >
            <el-option
              v-for="option in enum4Data.enmuOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="countryCode" label="国家">
          <el-select v-model="ruleForm.countryCode" placeholder="请选择国家">
            <el-option
              v-for="option in enum5Data.enmuOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="minTransitDays" label="最小运输天数">
          <el-input
            v-model="ruleForm.minTransitDays"
            placeholder="请输入最小运输天数"
          />
        </el-form-item>
        <el-form-item prop="maxTransitDays" label="最大运输天数">
          <el-input
            v-model="ruleForm.maxTransitDays"
            placeholder="请输入最大运输天数"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: center">
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
