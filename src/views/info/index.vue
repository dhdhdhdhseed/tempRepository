<template>
  <div class="user-info-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? "编辑系统配置" : "系统配置信息" }}</span>
          <div>
            <el-button
              type="primary"
              @click="toggleEditMode"
              :icon="isEditMode ? Edit : View"
            >
              {{ isEditMode ? "取消编辑" : "编辑配置" }}
            </el-button>
            <el-button
              v-if="isEditMode"
              type="success"
              @click="saveConfig"
              :icon="Check"
            >
              保存配置
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="configForm"
        :model="configInfo"
        :rules="rules"
        label-width="220px"
        label-position="right"
      >
        <el-collapse v-model="activeCollapse">
          <!-- AWS 配置 -->
          <el-collapse-item title="AWS 服务配置" name="aws">
            <el-form-item label="亚马逊访问Key" prop="awsAccessKey">
              <el-input
                v-model="configInfo.awsAccessKey"
                :disabled="!isEditMode"
                placeholder="输入AWS访问密钥"
                show-password
              />
            </el-form-item>

            <el-form-item label="亚马逊安全Key" prop="awsSecretKey">
              <el-input
                v-model="configInfo.awsSecretKey"
                :disabled="!isEditMode"
                placeholder="输入AWS秘密密钥"
                show-password
              />
            </el-form-item>

            <el-form-item label="亚马逊角色定义" prop="awsRoleArn">
              <el-input
                v-model="configInfo.awsRoleArn"
                :disabled="!isEditMode"
                placeholder="输入AWS角色ARN"
              />
            </el-form-item>
          </el-collapse-item>

          <!-- 运输管理配置 -->
          <el-collapse-item title="运输管理配置" name="tms">
            <el-form-item label="运单号校验表达式" prop="shipmentIdVerifyRegex">
              <el-input
                v-model="configInfo.shipmentIdVerifyRegex"
                :disabled="!isEditMode"
                placeholder="输入运单号校验正则表达式"
              />
            </el-form-item>

            <el-form-item prop="tmsRequestCertificate1">
              <template #label>
                <span>访问TMS凭证1</span>
                <el-tooltip
                  effect="dark"
                  content="访问TMS凭证（新智慧请填写查询运单和路由轨迹企业接口的token，token请携带Bearer+空格）"
                  placement="top"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              <el-input
                v-model="configInfo.tmsRequestCertificate1"
                :disabled="!isEditMode"
                placeholder="输入访问TMS凭证（新智慧请填写查询运单和路由轨迹企业接口的token，token请携带Bearer+空格）"
                type="textarea"
                :rows="3"
              />
            </el-form-item>

            <el-form-item prop="tmsRequestCertificate2">
              <template #label>
                <span>访问TMS凭证2</span>
                <el-tooltip
                  effect="dark"
                  content="访问TMS凭证（新智慧请填写查询运单和路由轨迹企业接口的token，token请携带Bearer+空格）"
                  placement="top"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              <el-input
                v-model="configInfo.tmsRequestCertificate2"
                :disabled="!isEditMode"
                placeholder="输入访问TMS凭证（新智慧请填写查询服务方法的公共接口的token，token请携带Bearer+空格）"
                type="textarea"
                :rows="3"
              />
            </el-form-item>

            <el-form-item
              label="TMS查询运单接口地址"
              prop="tmsShipmentSelectUrl"
            >
              <el-input
                v-model="configInfo.tmsShipmentSelectUrl"
                :disabled="!isEditMode"
                placeholder="输入TMS查询运单接口地址"
              />
            </el-form-item>

            <el-form-item
              label="TMS路由跟踪接口地址"
              prop="tmsShipmentTraceUrl"
            >
              <el-input
                v-model="configInfo.tmsShipmentTraceUrl"
                :disabled="!isEditMode"
                placeholder="输入TMS路由跟踪接口地址"
              />
            </el-form-item>

            <el-form-item
              label="TMS服务方式查询接口地址"
              prop="tmsServiceInfoSelectUrl"
            >
              <el-input
                v-model="configInfo.tmsServiceInfoSelectUrl"
                :disabled="!isEditMode"
                placeholder="输入TMS服务方式查询接口地址"
              />
            </el-form-item>
          </el-collapse-item>

          <!-- 回调配置 -->
          <el-collapse-item title="回调配置" name="callback">
            <el-form-item
              label="推送运单回调接口凭证"
              prop="nextslsCallbackCertificate"
            >
              <el-input
                v-model="configInfo.nextslsCallbackCertificate"
                :disabled="!isEditMode"
                placeholder="输入推送运单回调接口凭证（新智慧填写对应的token）"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit, View, Check, QuestionFilled } from "@element-plus/icons-vue";

import { carrierDetail, carrierUpdate } from "@/api/manage/index";

// 表单引用
const configForm = ref(null);

// 编辑模式状态
const isEditMode = ref(false);

// 展开的折叠面板
const activeCollapse = ref(["aws", "tms", "callback"]);

// 配置信息数据
const configInfo = reactive({
  shipmentIdVerifyRegex: "^[A-Za-z0-9]{10,20}$",
  awsAccessKey: "",
  awsSecretKey: "",
  awsRoleArn: "",
  tmsRequestCertificate1: "Bearer your_token_here",
  tmsRequestCertificate2: "Bearer your_token_here",
  tmsShipmentSelectUrl: "https://api.example.com/tms/shipments/select",
  tmsShipmentTraceUrl: "https://api.example.com/tms/shipments/trace",
  tmsServiceInfoSelectUrl: "https://api.example.com/tms/service/info",
  nextslsCallbackCertificate: "Bearer your_token_here",
});

// 表单验证规则 - 所有字段都要求必填
const rules = reactive({
  shipmentIdVerifyRegex: [
    { required: true, message: "请输入运单号校验表达式", trigger: "blur" },
  ],
  awsAccessKey: [
    { required: true, message: "请输入亚马逊访问Key", trigger: "blur" },
  ],
  awsSecretKey: [
    { required: true, message: "请输入亚马逊安全Key", trigger: "blur" },
  ],
  awsRoleArn: [
    { required: true, message: "请输入亚马逊角色定义", trigger: "blur" },
  ],
  tmsRequestCertificate1: [
    {
      required: true,
      message:
        "输入访问TMS凭证（新智慧请填写查询运单和路由轨迹企业接口的token，token请携带Bearer+空格）",
      trigger: "blur",
    },
  ],
  tmsRequestCertificate2: [
    {
      required: true,
      message:
        "输入访问TMS凭证（新智慧请填写查询服务方法的公共接口的token，token请携带Bearer+空格）",
      trigger: "blur",
    },
  ],
  tmsShipmentSelectUrl: [
    { required: true, message: "请输入TMS查询运单接口地址", trigger: "blur" },
    { type: "url", message: "请输入有效的URL", trigger: "blur" },
  ],
  tmsShipmentTraceUrl: [
    { required: true, message: "请输入TMS路由跟踪接口地址", trigger: "blur" },
    { type: "url", message: "请输入有效的URL", trigger: "blur" },
  ],
  tmsServiceInfoSelectUrl: [
    {
      required: true,
      message: "请输入TMS服务方式查询接口地址",
      trigger: "blur",
    },
    { type: "url", message: "请输入有效的URL", trigger: "blur" },
  ],
  nextslsCallbackCertificate: [
    { required: true, message: "请输入推送运单回调接口凭证", trigger: "blur" },
  ],
});

// 切换编辑模式
const toggleEditMode = () => {
  if (isEditMode.value) {
    // 取消编辑，恢复原始数据
    resetForm();
  }
  isEditMode.value = !isEditMode.value;
};

// 重置表单
const resetForm = () => {
  // 这里可以添加从服务器重新获取配置的逻辑
  Object.assign(configInfo, {
    shipmentIdVerifyRegex: "",
    awsAccessKey: "",
    awsSecretKey: "",
    awsRoleArn: "",
    tmsRequestCertificate1: "",
    tmsRequestCertificate2: "",
    tmsShipmentSelectUrl: "",
    tmsShipmentTraceUrl: "",
    tmsServiceInfoSelectUrl: "",
    nextslsCallbackCertificate: "",
  });
};

// 保存配置
const saveConfig = async () => {
  try {
    // 验证表单
    await configForm.value.validate();

    // 确认保存
    await ElMessageBox.confirm("确定要保存当前配置吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    doCarrierUpdate();

    // 可以在这里添加保存成功后的逻辑，如刷新数据等
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("保存失败，请检查表单");
    }
    console.error("保存失败:", error);
  }
};

function doCarrierUpdate() {
  carrierUpdate(configInfo).then((res) => {
    if (res.code === "000000") {
      isEditMode.value = false;
      ElMessage.success("配置保存成功");
    }
  });
}

function getCarrierDetail() {
  carrierDetail().then((res) => {
    if (res.code === "000000") {
      // Object.assign(configInfo, res.data);
      configInfo.shipmentIdVerifyRegex = res.data.shipmentIdVerifyRegex;
      configInfo.awsAccessKey = res.data.awsAccessKey;
      configInfo.awsSecretKey = res.data.awsSecretKey;
      configInfo.awsRoleArn = res.data.awsRoleArn;
      configInfo.tmsRequestCertificate1 = res.data.tmsRequestCertificate1;
      configInfo.tmsRequestCertificate2 = res.data.tmsRequestCertificate2;
      configInfo.tmsShipmentSelectUrl = res.data.tmsShipmentSelectUrl;
      configInfo.tmsShipmentTraceUrl = res.data.tmsShipmentTraceUrl;
      configInfo.tmsServiceInfoSelectUrl = res.data.tmsServiceInfoSelectUrl;
      configInfo.nextslsCallbackCertificate =
        res.data.nextslsCallbackCertificate;
    }
  });
}

// 组件挂载时获取配置数据
onMounted(() => {
  getCarrierDetail();
});
</script>

<style scoped>
.user-info-container {
  padding: 20px;
}

.box-card {
  /* max-width: 1200px; */
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-collapse-item {
  margin-bottom: 10px;
}

.el-collapse-item__header {
  font-weight: bold;
  background-color: #f5f7fa;
}

.el-textarea {
  font-family: monospace;
}
</style>
