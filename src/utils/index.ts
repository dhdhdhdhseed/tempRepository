import { removeConfigLayout } from '@/utils/cache/local-storage'
import dayjs from 'dayjs'

/** 格式化时间 */
export function formatDateTime(time: string | number | Date) {
  return time ? dayjs(new Date(time)).format('YYYY-MM-DD HH:mm:ss') : 'N/A'
}

/** 用 JS 获取全局 css 变量 */
export function getCssVariableValue(cssVariableName: string) {
  let cssVariableValue = ''
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  }
  catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** 用 JS 设置全局 CSS 变量 */
export function setCssVariableValue(cssVariableName: string, cssVariableValue: string) {
  try {
    document.documentElement.style.setProperty(cssVariableName, cssVariableValue)
  }
  catch (error) {
    console.error(error)
  }
}

/** 重置项目配置 */
export function resetConfigLayout() {
  removeConfigLayout()
  location.reload()
}

// #region 搜索栏数据处理
export function loadSearchOptions(key: string, data: any, searchFormConfig: readonly SearchConfigItem[]): void {
  searchFormConfig.forEach((it: any) => {
    if (it.prop === key) {
      it.options = data
    }
  })
}
// #endregion

/**
 * 表格数据列合并 (相邻列数据相同时数据合并)
 * @param param0 // 表格 row
 * @param {Array} tableData // 表格数据源
 * @param {Array} filter // 不需要合并的字段（prop） ['origin', 'VolumeAndWeight']
 * @returns
 */
export function objectSpanMethod({ row, column, rowIndex, columnIndex }: any, tableData: any[], filter: string[] = []) {
  const data = tableData
  const cellValue = row[column.property] // 当前位置的值
  if (cellValue && !filter.includes(column.property)) {
    const prevRow = data[rowIndex - 1] // 获取到上一条数据
    let nextRow = data[rowIndex + 1] // 下一条数据
    if (prevRow && prevRow[column.property] === cellValue) {
      // 当有上一条数据，并且和当前值相等时
      return { rowspan: 0, colspan: 0 }
    }
    else {
      let countRowspan = 1
      while (nextRow && nextRow[column.property] === cellValue) {
        // 当有下一条数据并且和当前值相等时,获取新的下一条
        nextRow = data[++countRowspan + rowIndex]
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }
}
