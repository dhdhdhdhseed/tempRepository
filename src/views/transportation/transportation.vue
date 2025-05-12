<script lang="ts" setup>
import { consoleTransportationModeSelectPageable } from '@/api/manage/index'
import Pagination from '@/components/Pagination/Pagination.vue'
import SearchBar from '@/components/SearchBar/index.vue'
import { onMounted, reactive, ref } from 'vue'

const loading = ref(false)

// #region 搜索栏
const searchConfig = [
  {
    type: 'input',
    label: '订单 ID',
    prop: 'id',
    placeholder: '请输入',
  },
  {
    type: 'select',
    label: '状态',
    prop: 'status',
    placeholder: '请选择',
    options: [],
  },
] as const

type SearchFrom = Record<(typeof searchConfig)[number]['prop'], string>
const searchFrom = reactive<Partial<SearchFrom>>({})

const paginationRef = ref()
const tableData = ref([])
const total = ref(0)
async function getTableData(page: PagePar) {
  const result = await consoleTransportationModeSelectPageable({
    ...page,
    ...searchFrom,
  })
  if (result.code === '000000') {

  }
}

onMounted(() => {
  paginationRef.value.changePage(1)
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <SearchBar v-model="searchFrom" :search-config="searchConfig" />
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            prop="id"
            label="订单 ID"
            align="center"
            width="150"
          />
          <el-table-column
            prop="merchantId"
            label="分销商 ID"
            align="center"
            width="170"
          />
          <el-table-column
            prop="supplierMerchantId"
            label="供应商 ID"
            align="center"
            width="170"
          />
          <el-table-column
            prop="totalPrice"
            label="总价"
            align="center"
            width="150"
          >
            <template #default="scope">
              ${{ scope.row.totalPrice.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="currency"
            label="币种"
            align="center"
            width="150"
          />
          <el-table-column
            prop="createdTime"
            label="创建时间"
            align="center"
            width="170"
          />
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
