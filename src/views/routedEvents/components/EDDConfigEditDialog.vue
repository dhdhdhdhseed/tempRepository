<script lang="ts" setup>
import type { ConsoleTransportationModeDataItem } from '@/api/manage/types/console'
import type { PropType } from 'vue'
import {
  consoleTrackingEventEddConfigUpdate,
} from '@/api/manage'
import { ElMessage } from 'element-plus'
import { defineExpose, reactive, ref } from 'vue'

const props = defineProps({
  dialogData: {
    type: Object,
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
  countryCode: string
  awsTransportMode: string
  delayDays: string
  trackingEventId: string
}
const ruleForm = reactive<FormData>({
  trackingEventId: '',
  countryCode: '',
  awsTransportMode: '',
  delayDays: '',
})
const rules = {
  delayDays: { required: true, message: '请输入延迟天使', trigger: 'blur' },
}

function handleSubmit() {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const result = await consoleTrackingEventEddConfigUpdate({
        trackingEventId: ruleForm.trackingEventId,
        countryCode: ruleForm.countryCode,
        awsTransportMode: ruleForm.awsTransportMode,
        delayDays: ruleForm.delayDays,
      })
      if (result.code === '000000') {
        ElMessage.success('操作成功')
        visible.value = false
        emits('dialogConfirm')
      }
    }
  })
}

function handleClose() {
  ruleFormRef.value.resetFields()
}

function onEnter() {
  if (props.dialogData?.trackingEventId) {
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
        size="small"
      >
        <el-form-item prop="awsTransportMode" label="运输方式">
          <el-input
            :value="enum3Data.enmuObject[ruleForm.awsTransportMode]?.value"
            placeholder="请输入运输方式"
            :disabled="true"
          />
          <!-- <el-select v-model="ruleForm.awsTransportMode">
            <el-option v-for="item in enum3Data.enmuOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item prop="countryCode" label="国家">
          <el-input
            :value="enum2Data.enmuObject[ruleForm.countryCode]?.value"
            placeholder="请输入国家"
            :disabled="true"
          />
          <!-- <el-select v-model="ruleForm.countryCode">
            <el-option v-for="item in enum2Data.enmuOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item prop="delayDays" label="延迟天数">
          <el-input v-model="ruleForm.delayDays" placeholder="请输入延迟天数" />
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
