<script lang="ts" setup>
import {
  consoleTransportationModeSelectPageable,
  consoleTransportationModeDelete,
} from "@/api/manage/index";
import Pagination from "@/components/Pagination/Pagination.vue";
import SearchBar from "@/components/SearchBar/index.vue";
import { useFetchEnum } from "@/hooks/userFetchEnum";
import { loadSearchOptions } from "@/utils";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import TransportationAddDialog from "./components/TransportationAddDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ConsoleTransportationModeDataItem } from "@/api/manage/types/console";

const loading = ref(false);

const searchConfig = [
  {
    type: "input",
    label: "服务代码",
    prop: "serviceCode",
    placeholder: "请输入",
  },
  {
    type: "select",
    label: "国家代码",
    prop: "countryCode",
    placeholder: "请选择",
    options: [],
  },
  {
    type: "select",
    label: "头程运输方式",
    prop: "awsTransportMode",
    placeholder: "请选择",
    options: [],
  },
  {
    type: "select",
    label: "尾程运输方式",
    prop: "lastLegDeliveryMode",
    placeholder: "请选择",
    options: [],
  },
] as const;
const enum2Data = useFetchEnum({ codeType: "2" }, () =>
  loadSearchOptions("awsTransportMode", enum2Data.enmuOptions, searchConfig)
);
const enum3Data = useFetchEnum({ codeType: "3" });
const enum4Data = useFetchEnum({ codeType: "4" }, () =>
  loadSearchOptions("lastLegDeliveryMode", enum4Data.enmuOptions, searchConfig)
);
const enum5Data = useFetchEnum({ codeType: "5" }, () =>
  loadSearchOptions("countryCode", enum5Data.enmuOptions, searchConfig)
);

type SearchFrom = Record<(typeof searchConfig)[number]["prop"], string>;
const searchFrom = reactive<Partial<SearchFrom>>({});

const paginationRef = ref();
const tableData = ref<ConsoleTransportationModeDataItem[]>([]);
const total = ref<number>(0);
async function getTableData(page: PagePar) {
  loading.value = true;
  try {
    const result = await consoleTransportationModeSelectPageable({
      ...page,
      ...searchFrom,
    });
    loading.value = false;
    if (result.code === "000000") {
      tableData.value = result.data.list;
      total.value = Number(result.data.total);
    }
  } catch (err) {
    console.error(err);
    loading.value = false;
  }
}
const multipleSelection = ref<any[]>([]);
function handleSelectionChange(selectedRows: any[]) {
  multipleSelection.value = selectedRows;
}
function handleSearch() {
  paginationRef.value.changePage(1);
}
function handleReset() {
  paginationRef.value.changePage(1);
}

function handleDelete(ids: string[]) {
  ElMessageBox.confirm("确定删除所选运输方式吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const result = await consoleTransportationModeDelete({ ids: ids });
    if (result.code === "000000") {
      ElMessage.success("删除成功");
      paginationRef.value.refresh();
    }
  });
}

// #region 运输方式添加、编辑弹窗
const transportationAddDialogRef = ref<DialogConfigVue | null>(null);
const transportationAddDialogData =
  ref<ConsoleTransportationModeDataItem | null>(null);
function handleOpenDialog(row?: ConsoleTransportationModeDataItem) {
  if(row){
    transportationAddDialogData.value = {...row};
  }
  if (transportationAddDialogRef.value) {
    transportationAddDialogRef.value.visible = true;
  }
}

onMounted(() => {
  paginationRef.value.changePage(1);
});
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
          <el-button type="primary" :icon="CirclePlus" @click="handleOpenDialog()">
            运输方式
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
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="carrierCode" label="运送者代码" />
          <el-table-column prop="countryCode" label="国家代码">
            <template #default="scoped">
              {{
                enum5Data.enmuObject[scoped.row.countryCode]?.value ||
                scoped.row.countryCode
              }}
            </template>
          </el-table-column>
          <el-table-column prop="awsTransportMode" label="头程运输方式">
            <template #default="scoped">
              {{
                enum2Data.enmuObject[scoped.row.awsTransportMode]?.value ||
                scoped.row.awsTransportMode
              }}
            </template>
          </el-table-column>
          <el-table-column prop="lastLegDeliveryMode" label="尾程运输方式">
            <template #default="scoped">
              {{
                enum4Data.enmuObject[scoped.row.lastLegDeliveryMode]?.value ||
                scoped.row.lastLegDeliveryMode
              }}
            </template>
          </el-table-column>
          <el-table-column prop="minTransitDays" label="最小运天数" />
          <el-table-column prop="maxTransitDays" label="最大运天数" />
          <el-table-column prop="serviceCode" label="服务代码" />
          <el-table-column prop="serviceLevel" label="服务级别">
            <template #default="scoped">
              {{
                enum3Data.enmuObject[scoped.row.serviceLevel.toUpperCase()]
                  ?.value || scoped.row.serviceLevel
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scoped">
              <el-button
                style="margin: 0"
                type="primary"
                text
                @click="handleOpenDialog(scoped.row)"
                >编辑</el-button
              >
              <el-button
                style="margin: 0"
                type="danger"
                text
                @click="handleDelete([scoped.row.id])"
                >删除</el-button
              >
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
    <TransportationAddDialog
      ref="transportationAddDialogRef"
      :dialog-data="transportationAddDialogData!"
      :enum2-data="enum2Data"
      :enum3-data="enum3Data"
      :enum4-data="enum4Data"
      :enum5-data="enum5Data"
      @dialogConfirm="() => paginationRef.refresh()"
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
