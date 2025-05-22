<script lang="ts" setup>
import {
  commoncodeDel,
  commoncodeNew,
  commoncodeSelectPageable,
} from '@/api/manage'
import Pagination from '@/components/Pagination/Pagination.vue'
import { CirclePlus } from '@element-plus/icons-vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { nextTick, onMounted, reactive, ref } from 'vue'

const paginationRef = ref()
onMounted(() => {
  nextTick(() => {
    paginationRef.value.changePage(1)
  })
})

// #region table数据
const tableData = ref<any[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)
// 获取table数据
function getTableData(page: PagePar) {
  loading.value = true
  const params = {
    ...page,
  }
  commoncodeSelectPageable(params)
    .then(({ data }: any) => {
      total.value = data.total * 1
      tableData.value = data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
// #endregion

// #region 运费模板
const FORM_DATA = reactive({
  codeType: undefined,
  value: undefined,
  code: undefined,
})
const updateFormRef = ref()
const updateDialogConfig = reactive<any>({
  open: false,
  data: cloneDeep(FORM_DATA),
  title: '新增承运商代码',
})
async function openUpdateFreightDialog() {
  updateDialogConfig.open = true
}
async function submitSave() {
  updateFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const params = {
        codeType: updateDialogConfig.data.codeType,
        value: updateDialogConfig.data.value,
        code: updateDialogConfig.data.code,
      }
      const result = await commoncodeNew(params)
      if (result.code === '000000') {
        ElMessage.success('新增成功')
        updateDialogConfig.open = false
        paginationRef.value.refresh()
      }
    }
  })
}

// 删除
async function onDelete(obj: any) {
  ElMessageBox.confirm(`确认删除？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    loading.value = true
    try {
      const result = await commoncodeDel(obj)
      loading.value = false
      if (result.code === '000000') {
        ElMessage.success('删除成功')
        paginationRef.value.refresh()
      }
    }
    catch (err) {
      console.error(err)
      loading.value = false
    }
  })
}

// 重置弹窗数据
function resetTemplateForm() {
  updateDialogConfig.data = cloneDeep(FORM_DATA)
  updateFormRef.value?.resetFields()
}

// #endregion
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper" style="margin-bottom: 10px">
        <div>
          <el-button
            type="primary"
            :icon="CirclePlus"
            @click="openUpdateFreightDialog()"
          >
            新增承运商公共代码
          </el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="codeType" label="类型" align="center" />
          <el-table-column prop="code" label="编码" align="center" />
          <el-table-column prop="value" label="对应值" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div
                style="
                  display: flex;
                  gap: 5px;
                  flex-wrap: wrap;
                  justify-content: center;
                "
              >
                <el-button
                  style="margin: 0"
                  type="danger"
                  text
                  @click="onDelete(scope.row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <Pagination
          ref="paginationRef"
          :total="Number(total)"
          @pagination="getTableData"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="updateDialogConfig.open"
      :title="updateDialogConfig.title"
      width="600px"
      @closed="resetTemplateForm"
    >
      <el-form
        ref="updateFormRef"
        :inline="false"
        :model="updateDialogConfig.data"
        label-width="6em"
      >
        <el-form-item prop="codeType" label="类型">
          <el-input
            v-model="updateDialogConfig.data.codeType"
            placeholder="请输入类型"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="code" label="编码">
          <el-input
            v-model="updateDialogConfig.data.code"
            placeholder="请输入编码"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="name" label="对应值">
          <el-input
            v-model="updateDialogConfig.data.value"
            placeholder="请输入对应值"
            style="width: 80%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="() => (updateDialogConfig.open = false)">
          取消
        </el-button>
        <el-button type="primary" @click="submitSave">
          保存修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
