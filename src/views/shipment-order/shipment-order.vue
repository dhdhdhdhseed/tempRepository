<script lang="ts" setup>
import type { ShipmentOrderItem } from '@/api/manage/types/console'
import { consoleShipmentOrderSelectPageable } from '@/api/manage/index'
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
          <el-table-column prop="fbaShipmentId" label="亚马逊运单ID" />
          <el-table-column prop="trackingId" label="运单ID" />

          <el-table-column prop="idSyncStatus" label="运单号同步状态">
            <template #default="scope">
              {{ scope.row.idSyncStatus === 0 ? "否" : "是" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ldTransportationInfoFirstSyncStatus"
            label="货件首次更新状态"
          >
            <template #default="scope">
              {{
                scope.row.ldTransportationInfoFirstSyncStatus === 0
                  ? "否"
                  : "是"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ldTransportationInfoLastSyncStatus"
            label="货件最后一次更新状态"
          >
            <template #default="scope">
              {{
                scope.row.ldTransportationInfoLastSyncStatus === 0 ? "否" : "是"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="completionStatus" label="运单同步状态">
            <template #default="scope">
              {{ scope.row.completionStatus === 0 ? "未完成" : "完成" }}
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="运单状态">
            <template #default="scope">
              {{ enum6Data.enmuObject[scope.row.orderStatus]?.value }}
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
