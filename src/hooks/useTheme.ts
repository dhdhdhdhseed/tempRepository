import { getActiveThemeName, setActiveThemeName } from '@/utils/cache/local-storage'
import Color from 'color'
import { ref, watchEffect } from 'vue'

const DEFAULT_THEME_NAME = 'normal'
type DefaultThemeName = typeof DEFAULT_THEME_NAME

/** 注册的主题名称, 其中 DefaultThemeName 是必填的 */
export type ThemeName = DefaultThemeName | 'dark' | 'dark-blue'

interface ThemeList {
  title: string
  name: ThemeName
  color: string
}

/** 主题列表 */
const themeList: ThemeList[] = [
  {
    title: '默认',
    name: DEFAULT_THEME_NAME,
    color: '#409EFF',
  },
  {
    title: '黑暗',
    name: 'dark',
    color: '#7587E5',
  },
  {
    title: '深蓝',
    name: 'dark-blue',
    color: '#00bb99',
  },
]

/** 正在应用的主题名称 */
const activeThemeName = ref<ThemeName>(getActiveThemeName() || DEFAULT_THEME_NAME)

/** 设置主题 */
function setTheme(value: ThemeName) {
  activeThemeName.value = value
  const color = themeList.find(item => item.name === value)?.color
  setThemeColor(color)
}

/** 在 html 根元素上挂载 class */
function setHtmlRootClassName(value: ThemeName) {
  document.documentElement.className = value
}

/** 初始化 */
function initTheme() {
  // watchEffect 来收集副作用
  watchEffect(() => {
    const value = activeThemeName.value
    const color = themeList.find(item => item.name === value)?.color
    setThemeColor(color)
    setHtmlRootClassName(value)
    setActiveThemeName(value)
  })
}
// 设置主题色
function setThemeColor(color: string = '#7587e5') {
  const root = document.documentElement
  root.style.setProperty('--main-color', color)
  const el = document.documentElement
  el.style.setProperty('--el-color-primary', color)
  el.style.setProperty('--el-color-primary-dark-2', Color(color).darken(0.3).desaturate(0.2).lighten(0.2).hex())
  for (let i = 1; i < 10; i++) {
    el.style.setProperty(
      `--el-color-primary-light-${i}`,
      Color(color).alpha(1 - i * 0.1).string(),
    )
  }
}

/** 主题 hook */
export function useTheme() {
  return { themeList, activeThemeName, initTheme, setTheme, setThemeColor }
}
