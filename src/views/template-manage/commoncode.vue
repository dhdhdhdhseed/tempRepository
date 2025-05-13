<script lang="ts" setup>
import {
  commoncodeDel,
  commoncodeNew,
  commoncodeSelectPageable,
} from '@/api/manage'
import Pagination from '@/components/Pagination/Pagination.vue'
import SearchBar from '@/components/SearchBar/index.vue'
import { CirclePlus } from '@element-plus/icons-vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { nextTick, onMounted, reactive, ref } from 'vue'
// const enum28Data = useFetchEnum({ id: '3', })
// const enum6Data = useFetchEnum({ id: '6', })

// const agentTypeOptions = ref<any[]>([]);
// const enum28Data = useFetchEnum({ id: "3" }, () => {
//   agentTypeOptions.value = enum28Data.enmuOptions; //.filter((it) => it.value === 'A' || it.value === 'SA')
// });

const paginationRef = ref()
onMounted(() => {
  // getBaseData();
  nextTick(() => {
    paginationRef.value.changePage(1)
  })
})

// #region table数据
const tableData = ref<TableData[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)
// 获取table数据
function getTableData(page: Page) {
  loading.value = true
  const params = {
    ...page,
    ...searchFrom,
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

// #region 基本数据
function getBaseData() {
  getFirstWarehouseSelect()
  getLastWarehouseSelect()
  getServiceList()
}
// 获取枚举数据
interface EunmObj {
  [key: string]: any
}
// 获取头程仓列表
const firstWarehouseOption = ref<any[]>([])
const firstWarehouseObj = reactive<EunmObj>({})
async function getFirstWarehouseSelect() {
  const params = {
    location: 'CN',
  }
  const result = await warehouseSelect(params)
  if (result.code === '000000') {
    firstWarehouseOption.value = result.data
    result.data.forEach((it: any) => {
      firstWarehouseObj[it.id] = it
    })
  }
}
// 获取尾程仓列表
const lastWarehouseOption = ref<any[]>([])
const lastWarehouseMap = reactive<EunmObj>({})
async function getLastWarehouseSelect() {
  const params = {
    location: 'US',
  }
  const result = await warehouseSelect(params)
  if (result.code === '000000') {
    lastWarehouseOption.value = result.data
    result.data.forEach((it: any) => {
      lastWarehouseMap[it.id] = it
    })
  }
}
// 获取运输服务列表
const serviceOption = ref<any[]>([])
const serviceObj = reactive<EunmObj>({})
async function getServiceList() {
  const result = await tmsServiceList({})
  if (result.code === '000000') {
    serviceOption.value = result.data
    result.data.forEach((it: any) => {
      serviceObj[it.code] = it
    })
  }
}
// #endregion

// #region 运费模板
const FORM_DATA = reactive({
  codeType: undefined,
  value: undefined,
  code: undefined,
})
const updateFormRef = ref()
const updateDialogConfig = reactive<DialogConfig<any>>({
  open: false,
  data: cloneDeep(FORM_DATA),
  title: '新增承运商代码',
})
async function openUpdateFreightDialog() {
  // const result = await warehouseShippingCodeDetail({ id: row.id })
  // updateDialogConfig.data = JSON.parse(JSON.stringify(row));
  updateDialogConfig.open = true
}
async function submitSave() {
  updateFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const params = {
        // "id": updateDialogConfig.data.id,
        codeType: updateDialogConfig.data.codeType,
        value: updateDialogConfig.data.value,
        code: updateDialogConfig.data.code,
        // language: updateDialogConfig.data.language,
        // orderValue: updateDialogConfig.data.orderValue,
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
      console.log(err)
      loading.value = false
    }
  })
}

// 重置弹窗数据
function resetTemplateForm() {
  updateDialogConfig.data = cloneDeep(FORM_DATA)
  updateFormRef.value?.resetFields()
}

const searchConfig = [
  {
    type: 'input',
    label: '类型',
    prop: 'codeType',
    placeholder: '请输入',
  },
] as const

type SearchFrom = Record<(typeof searchConfig)[number]['prop'], string>
const searchFrom = reactive<Partial<SearchFrom>>({
  codeType: 0,
})

function handleSearch() {
  paginationRef.value.changePage(1)
}
function handleReset() {
  paginationRef.value.changePage(1)
}

// #endregion
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <SearchBar
        v-model="searchFrom"
        :search-config="searchConfig"
        @search="handleSearch"
        @reset="handleReset"
      />
    </el-card>
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
          <!-- <el-table-column prop="id" label="ID" align="center" /> -->
          <!-- <el-table-column prop="code" label="类型" align="center" /> -->
          <!-- <el-table-column prop="code" label="商户类型" align="center">
            <template #default="scope">
              {{ enum28Data.enmuObject[scope.row.code]?.value }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="language" label="语言" align="center" /> -->
          <el-table-column prop="codeType" label="类型" align="center" />
          <el-table-column prop="code" label="编码" align="center" />
          <el-table-column prop="value" label="对应值" align="center" />
          <!-- <el-table-column label="排序" align="center">
            <template #default="scope">
              <span>{{ scope.row.orderValue }}</span>
              <el-icon
                class="theme_color"
                style="cursor: pointer; margin-left: 5px"
                @click="openUpdateFreightDialog(scope.row)"
              >
                <Edit />
              </el-icon>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="createdTime" label="创建时间" align="center" />
          <el-table-column prop="updatedTime" label="更新时间" align="center" /> -->
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
