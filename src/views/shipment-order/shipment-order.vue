<script lang="ts" setup>
import type { ShipmentOrderItem } from '@/api/manage/types/console'
import {
  consoleShipmentOrderSelectPageable,
  consoleShipmentOrderUpdate,
} from '@/api/manage/index'
import Pagination from '@/components/Pagination/Pagination.vue'
import SearchBar from '@/components/SearchBar/index.vue'
import { useFetchEnum } from '@/hooks/userFetchEnum'
import { onMounted, reactive, ref } from 'vue'

const loading = ref(false)

const searchConfig: SearchConfigItem[] = [
  {
    type: 'input',
    label: '运单ID',
    prop: 'trackingId',
    placeholder: '请输入',
  },
  {
    type: 'select',
    label: '只查询错误订单',
    prop: 'queryError',
    placeholder: '请选择',
    options: [
      { label: '是', value: true },
      { label: '否', value: false },
    ],
  },
]
const enum6Data = useFetchEnum({ codeType: '6' })

type SearchFrom = Record<(typeof searchConfig)[number]['prop'], string>
const searchFrom = reactive<Partial<SearchFrom>>({})

const paginationRef = ref()
const tableData = ref<ShipmentOrderItem[]>([])
const total = ref<number>(0)
async function getTableData(page: PagePar) {
  loading.value = true
  try {
    const result = await consoleShipmentOrderSelectPageable({
      ...page,
      ...searchFrom,
    })
    loading.value = false
    if (result.code === '000000') {
      tableData.value = result.data.list
      total.value = Number(result.data.total)
    }
  }
  catch (err) {
    console.error(err)
    loading.value = false
  }
}

const multipleSelection = ref<ShipmentOrderItem[]>([])
function handleSelectionChange(selectedRows: ShipmentOrderItem[]) {
  multipleSelection.value = selectedRows
}
function handleSearch() {
  paginationRef.value.changePage(1)
}
function handleReset() {
  paginationRef.value.changePage(1)
}

const orderUpdateFormRef = ref()
const orderUpdateForm = reactive({
  id: '',
  idSyncStatus: 0,
  ldTransportationInfoFirstSyncStatus: 0,
  ldTransportationInfoLastSyncStatus: 0,
  completionStatus: 0,
})
const orderUpdateDialogVisible = ref(false)
function onUpdate(row: any) {
  Object.assign(orderUpdateForm, row)
  orderUpdateDialogVisible.value = true
}

function resetOrderUpdateForm() {
  if (orderUpdateFormRef.value) {
    orderUpdateFormRef.value.resetFields()
  }
}

function handleSubmitUpdate() {
  consoleShipmentOrderUpdate({
    id: orderUpdateForm.id,
    idSyncStatus: orderUpdateForm.idSyncStatus,
    ldTransportationInfoLastSyncStatus:
      orderUpdateForm.ldTransportationInfoLastSyncStatus,
    ldTransportationInfoFirstSyncStatus:
      orderUpdateForm.ldTransportationInfoFirstSyncStatus,
    completionStatus: orderUpdateForm.completionStatus,
  }).then(() => {
    resetOrderUpdateForm()
    orderUpdateDialogVisible.value = false
    paginationRef.value.refresh()
  })
}

onMounted(() => {
  paginationRef.value.changePage(1)
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <SearchBar
        :model-value="searchFrom"
        :search-config="searchConfig"
        @search="handleSearch"
        @reset="handleReset"
      />
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table
          :data="tableData"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="trackingId" label="运单ID" />
          <el-table-column prop="fbaShipmentId" label="亚马逊运单ID" />

          <el-table-column prop="idSyncStatus" label="运单号映射状态">
            <template #default="scope">
              {{ scope.row.idSyncStatus === 0 ? "未完成" : scope.row.idSyncStatus === 1 ? "完成" : '异常' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ldTransportationInfoFirstSyncStatus"
            label="货件首次更新状态"
          >
            <template #default="scope">
              {{
                scope.row.ldTransportationInfoFirstSyncStatus === 0
                  ? "未完成"
                  : scope.row.ldTransportationInfoFirstSyncStatus === 1 ? "完成" : '异常'
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ldTransportationInfoLastSyncStatus"
            label="货件最后一次更新状态"
          >
            <template #default="scope">
              {{
                scope.row.ldTransportationInfoLastSyncStatus === 0 ? "未完成" : scope.row.ldTransportationInfoLastSyncStatus === 1 ? "完成" : '异常'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="completionStatus" label="运单同步状态">
            <template #default="scope">
              {{ scope.row.completionStatus === 1 ? "完成" : "未完成" }}
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="运单状态">
            <template #default="scope">
              {{ enum6Data.enmuObject[scope.row.orderStatus]?.value }}
            </template>
          </el-table-column>
          <el-table-column prop="errorCode" label="错误代码" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" text @click="onUpdate(scope.row)">
                更新运单状态
              </el-button>
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
      v-model="orderUpdateDialogVisible"
      title="更新运单状态"
      width="400px"
      @closed="resetOrderUpdateForm"
    >
      <el-form
        ref="orderUpdateFormRef"
        :model="orderUpdateForm"
        label-width="15em"
      >
        <el-form-item label="运单号同步状态">
          <el-switch
            v-model="orderUpdateForm.idSyncStatus"
            inline-prompt
            active-text="完成"
            inactive-text="未完成"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="货件首次更新状态">
          <el-switch
            v-model="orderUpdateForm.ldTransportationInfoFirstSyncStatus"
            inline-prompt
            active-text="完成"
            inactive-text="未完成"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="货件最后一次更新状态">
          <el-switch
            v-model="orderUpdateForm.ldTransportationInfoLastSyncStatus"
            inline-prompt
            active-text="完成"
            inactive-text="未完成"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="运单同步状态">
          <el-switch
            v-model="orderUpdateForm.completionStatus"
            :active-value="1"
            inline-prompt
            active-text="完成"
            inactive-text="未完成"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="orderUpdateDialogVisible = false">
            取 消
          </el-button>
          <el-button type="primary" @click="handleSubmitUpdate">
            确 定
          </el-button>
        </div>
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
