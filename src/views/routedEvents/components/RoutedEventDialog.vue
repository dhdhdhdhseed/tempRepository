<script lang="ts" setup>
import type { ConsoleTransportationModeDataItem } from '@/api/manage/types/console'
import type { PropType } from 'vue'
import {
  consoleTrackingEventConfigNew,
  consoleTrackingEventConfigUpdate,
} from '@/api/manage'
import { objectSpanMethod } from '@/utils/index'
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
})
const emits = defineEmits(['dialogConfirm'])

const visible = ref(false)
const loading = ref(false)

const ruleFormRef = ref()
interface FormData {
  eventName: string
  includeKeyWord: string
  excludeKeyWord: string
  trackingEventEddConfigs: {
    countryCode: string
    awsTransportMode: string
    delayDays: number
  }[]
  id: string
}
const trackingEventEddConfigs = ref<any[]>([])
const ruleForm = reactive<FormData>({
  id: '',
  eventName: '',
  includeKeyWord: '',
  excludeKeyWord: '',
  trackingEventEddConfigs: [],
})
function validateEddConfigs(
  rule: any,
  value: string,
  callback: Function,
  item: any,
  attr: any,
) {
  if (trackingEventEddConfigs.value.every(it => it.delayDays !== '')) {
    callback()
  }
  else {
    callback(new Error('延迟天数不能为空'))
  }
}
const rules = {
  eventName: { required: true, message: '请输入事件名称', trigger: 'blur' },
  includeKeyWord: {
    required: true,
    message: '请输入包含关键字',
    trigger: 'blur',
  },
  trackingEventEddConfigs: { required: true, validator: validateEddConfigs },
}

function handleSubmit() {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (ruleForm.id) {
        const result = await consoleTrackingEventConfigUpdate({
          id: ruleForm.id,
          includeKeyWord: ruleForm.includeKeyWord,
          excludeKeyWord: ruleForm.excludeKeyWord,
        })
        if (result.code === '000000') {
          ElMessage.success('操作成功')
          visible.value = false
          emits('dialogConfirm')
        }
      }
      else {
        // 遍历查询延迟天数是否全部填写
        if (
          trackingEventEddConfigs.value.every((it) => {
            if (
              it.delayDays === ''
              || it.delayDays === null
              || it.delayDays === undefined
            ) {
              ElMessage.error(`请填写 ${props.enum2Data.enmuObject[it.countryCode]?.value} - ${props.enum3Data.enmuObject[it.awsTransportMode]?.value} 延迟天数`)
            }
            return it.delayDays !== '' && it.delayDays !== null && it.delayDays !== undefined
          })
        ) {
          ruleForm.trackingEventEddConfigs = trackingEventEddConfigs.value
          const result = await consoleTrackingEventConfigNew(ruleForm)
          if (result.code === '000000') {
            ElMessage.success('操作成功')
            visible.value = false
            emits('dialogConfirm')
          }
        }
      }
    }
  })
}

function handleClose() {
  ruleFormRef.value.resetFields()
  ruleForm.id = ''
}

function onEnter() {
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
    // 获取所有EDD配置列表
  }
  trackingEventEddConfigs.value = props.enum2Data.enmuOptions.flatMap(
    (a: Option) =>
      props.enum3Data.enmuOptions.map((b: Option) => ({
        countryCode: a.value,
        awsTransportMode: b.value,
        delayDays: '',
      })),
  )
}

defineExpose({
  visible,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="dialogData?.id ? '路由事件编辑' : '路由事件添加'"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    :destroy-on-close="true"
    :append-to-body="true"
    top="5vh"
    @open="onEnter"
    @closed="handleClose"
  >
    <div class="FD-dialog-body">
      <el-form
        ref="ruleFormRef"
        :inline="false"
        :model="ruleForm"
        :rules="rules"
        label-width="10em"
        size="small"
      >
        <el-form-item prop="eventName" label="事件名称">
          <el-input
            v-model="ruleForm.eventName"
            placeholder="请输入事件名称"
            :disabled="ruleForm.id?.length"
          />
        </el-form-item>
        <el-form-item prop="includeKeyWord" label="包含关键字">
          <el-input v-model="ruleForm.includeKeyWord" placeholder="请输入包含关键字,多个关键字请用'|'符号分割" />
        </el-form-item>
        <el-form-item prop="excludeKeyWord" label="排除关键字">
          <el-input v-model="ruleForm.excludeKeyWord" placeholder="请输入排除关键字,多个关键字请用'|'符号分割" />
        </el-form-item>
        <el-form-item
          v-if="!ruleForm.id"
          label="跟踪事件EDD配置"
          size="small"
          required
        >
          <el-table
            :data="trackingEventEddConfigs"
            :span-method="(row:any) => objectSpanMethod(row, trackingEventEddConfigs, ['delayDays'])"
            border
          >
            <el-table-column prop="countryCode" label="国家" width="180">
              <template #default="scope">
                {{ enum2Data.enmuObject[scope.row.countryCode]?.value }}
              </template>
            </el-table-column>
            <el-table-column
              prop="awsTransportMode"
              label="运输方式"
              width="180"
            >
              <template #default="scope">
                {{ enum3Data.enmuObject[scope.row.awsTransportMode]?.value }}
              </template>
            </el-table-column>
            <el-table-column prop="delayDays" label="延迟天数">
              <template #default="scope">
                <el-input
                  v-model="scope.row.delayDays"
                  placeholder="请输入延迟天数"
                />
              </template>
            </el-table-column>
          </el-table>
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
