<script lang="ts" setup>
import { defineExpose, reactive, ref } from "vue";
import { consoleTransportationModeNew } from "@/api/manage";
import { ElMessage } from "element-plus";
const emits = defineEmits(['dialogConfirm'])
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
  enum4Data: {
    type: Object,
    required: true,
  },
  enum5Data: {
    type: Object,
    required: true,
  },
});
const visible = ref(false);
const loading = ref(false);

const ruleFormRef = ref();
interface FormData {
  serviceCode: string | undefined;
  awsTransportMode: string | undefined;
  serviceLevel: string | undefined;
  lastLegDeliveryMode: string | undefined;
  countryCode: string | undefined;
  minTransitDays: string | undefined;
  maxTransitDays: string | undefined;
}
const ruleForm = reactive<FormData>({
  serviceCode: undefined,
  awsTransportMode: undefined,
  serviceLevel: undefined,
  lastLegDeliveryMode: undefined,
  countryCode: undefined,
  minTransitDays: undefined,
  maxTransitDays: undefined,
});
const rules = {};

function handleSubmit() {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const result = await consoleTransportationModeNew(ruleForm);
      if (result.code === "000000") {
        ElMessage.success("新增成功");
        visible.value = false;
        emits('dialogConfirm')
      }
    }
  });
}
function handleClose() {
  ruleFormRef.value.resetFields();
}

defineExpose({
  visible,
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="dialogData?.id? '运输方式编辑' : '运输方式添加'"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :destroy-on-close="true"
    :append-to-body="true"
    @closed="handleClose"
  >
    <div class="FD-dialog-body">
      <el-form
        ref="ruleFormRef"
        :inline="false"
        :model="ruleForm"
        :rules="rules"
        label-width="10em"
      >
        <el-form-item prop="serviceCode" label="服务代码">
          <el-input
            v-model="ruleForm.serviceCode"
            placeholder="请输入模板名称"
          />
        </el-form-item>
        <el-form-item prop="serviceLevel" label="服务级别">
          <el-select
            v-model="ruleForm.serviceLevel"
            placeholder="请输入模板名称"
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
            placeholder="请输入模板名称"
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
            placeholder="请输入模板名称"
            >
            <el-option
              v-for="option in enum4Data.enmuOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="countryCode" label="所属国家">
          <el-select
            v-model="ruleForm.countryCode"
            placeholder="请输入模板名称"
          >
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
            placeholder="请输入模板名称"
          />
        </el-form-item>
        <el-form-item prop="maxTransitDays" label="最大运输天数">
          <el-input
            v-model="ruleForm.maxTransitDays"
            placeholder="请输入模板名称"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: center">
        <el-button @click="visible = false"> 取消 </el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
