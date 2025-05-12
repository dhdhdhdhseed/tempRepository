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
