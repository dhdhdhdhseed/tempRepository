<script lang="ts" setup>
import type { ConsoleTransportationModeDataItem } from '@/api/manage/types/console'
import {
  consoleCommonCodeCarrierSelectCodeType,
  consoleTrackingEventConfigDelete,
  consoleTrackingEventConfigList,
  consoleTrackingEventEddConfigSelectPageable,
} from '@/api/manage/index'
import Pagination from '@/components/Pagination/Pagination.vue'
import { useFetchEnum } from '@/hooks/userFetchEnum'
import { objectSpanMethod } from '@/utils/index'
import { CirclePlus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { nextTick, onMounted, ref } from 'vue'
import EDDConfigEditDialog from './components/EDDConfigEditDialog.vue'
import RoutedEventDialog from './components/RoutedEventDialog.vue'

const enum2Data = useFetchEnum({
  codeType: '2',
  api: consoleCommonCodeCarrierSelectCodeType,
})
const enum3Data = useFetchEnum({
  codeType: '3',
  api: consoleCommonCodeCarrierSelectCodeType,
})

const loading = ref(false)
const tableData = ref<ConsoleTransportationModeDataItem[]>([])
async function getTableData() {
  loading.value = true
  try {
    const result = await consoleTrackingEventConfigList()
    loading.value = false
    if (result.code === '000000') {
      tableData.value = result.data
    }
  }
  catch (err) {
    console.error(err)
    loading.value = false
  }
}

const childrenTableLoading = ref<boolean>(false)
const childrenPaginationRef = ref()
const selectedRow = ref<any>({})
const childrenData = ref<any[]>([])
const childrenTotal = ref<number>(0)

async function getTableChildren(page: any) {
  childrenTableLoading.value = true
  try {
    const result = await consoleTrackingEventEddConfigSelectPageable({
      ...page,
      id: selectedRow.value?.id,
    })
    childrenTableLoading.value = false
    if (result.code === '000000') {
      childrenData.value = result.data.list
      childrenTotal.value = result.data.total
    }
  }
  catch (err) {
    console.error(err)
    childrenTableLoading.value = false
  }
}
const expandedRowKeys = ref<any[]>([])
function loadChildren(row: any, expandedRows: any[]) {
  const index = expandedRows.findIndex((r: any) => r.id === row.id)
  if (index !== -1) {
    expandedRowKeys.value = [row.id]
  }
  else {
    expandedRowKeys.value = expandedRowKeys.value.filter(
      key => key !== row.id,
    )
  }

  selectedRow.value = row
  nextTick(() => {
    childrenPaginationRef.value.changePage(1)
  })
}

const multipleSelection = ref<ConsoleTransportationModeDataItem[]>([])
function handleSelectionChange(
  selectedRows: ConsoleTransportationModeDataItem[],
) {
  multipleSelection.value = selectedRows
}

function handleDelete(ids: string[]) {
  if (!ids || ids.length === 0) {
    ElMessage.warning('请选择要删除的路由事件')
    return
  }
  ElMessageBox.confirm('确定删除所选路由事件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result = await consoleTrackingEventConfigDelete({ ids })
    if (result.code === '000000') {
      ElMessage.success('删除成功')
      getTableData()
    }
  })
}

// #region 运输方式添加、编辑弹窗
const transportationAddDialogRef = ref<DialogConfigVue | null>(null)
const transportationAddDialogData
  = ref<ConsoleTransportationModeDataItem | null>(null)
function handleOpenDialog(row?: ConsoleTransportationModeDataItem) {
  if (row) {
    transportationAddDialogData.value = { ...row }
  }
  else {
    transportationAddDialogData.value = null
  }
  if (transportationAddDialogRef.value) {
    transportationAddDialogRef.value.visible = true
  }
}

const EDDConfigEditDialogRef = ref()
const childrenEditDialogData = ref({})
function handleChildrenDialog(row: any) {
  childrenEditDialogData.value = row
  EDDConfigEditDialogRef.value.visible = true
}

onMounted(() => {
  getTableData()
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper" style="margin-bottom: 10px">
        <div>
          <el-button
            type="primary"
            :icon="CirclePlus"
            @click="handleOpenDialog()"
          >
            添加路由事件
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            @click="handleDelete(multipleSelection.map((it) => it.id))"
          >
            批量删除
          </el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          :data="tableData"
          stripe
          row-key="id"
          :expand-row-keys="expandedRowKeys"
          @selection-change="handleSelectionChange"
          @expand-change="loadChildren"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="expand">
            <template #default>
              <div
                style="padding: 10px 10px 10px 100px; background-color: #f1f1f1"
              >
                <el-table
                  v-loading="childrenTableLoading"
                  :data="childrenData"
                  border
                  size="small"
                  :span-method="(row:any) => objectSpanMethod(row, childrenData, ['awsTransportMode', 'delayDays'])"
                >
                  <el-table-column
                    label="国家"
                    prop="countryCode"
                    align="center"
                  >
                    <template #default="scope">
                      {{ enum2Data.enmuObject[scope.row.countryCode]?.value }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="运输方式"
                    prop="awsTransportMode"
                    align="center"
                  >
                    <template #default="scope">
                      {{
                        enum3Data.enmuObject[scope.row.awsTransportMode]?.value
                      }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="延迟天数"
                    prop="delayDays"
                    align="center"
                  />
                  <el-table-column label="操作">
                    <template #default="scoped">
                      <el-button
                        style="margin: 0"
                        type="primary"
                        text
                        @click="handleChildrenDialog(scoped.row)"
                      >
                        编辑
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pager-wrapper" style="justify-content: center">
                  <Pagination
                    ref="childrenPaginationRef"
                    :total="Number(childrenTotal)"
                    :props-config="{ size: 'small' }"
                    @pagination="getTableChildren"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="eventName" label="事件名称" />
          <el-table-column prop="includeKeyWord" label="包含关键字" />
          <el-table-column prop="excludeKeyWord" label="排除关键字" />
          <el-table-column label="操作">
            <template #default="scoped">
              <el-button
                style="margin: 0"
                type="primary"
                text
                @click="handleOpenDialog(scoped.row)"
              >
                编辑
              </el-button>
              <el-button
                style="margin: 0"
                type="danger"
                text
                @click="handleDelete([scoped.row.id])"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <RoutedEventDialog
      ref="transportationAddDialogRef"
      :dialog-data="transportationAddDialogData!"
      :enum2-data="enum2Data"
      :enum3-data="enum3Data"
      @dialog-confirm="() => getTableData()"
    />
    <EDDConfigEditDialog
      ref="EDDConfigEditDialogRef"
      :enum2-data="enum2Data"
      :enum3-data="enum3Data"
      :dialog-data="childrenEditDialogData!"
      @dialog-confirm="() => childrenPaginationRef.refresh()"
    />
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
