import { LayoutModeEnum } from '@/config/constants'
import { getConfigLayout } from '@/utils/cache/local-storage'

/** 项目配置类型 */
export interface LayoutSettings {
  /** 是否显示 Settings Panel */
  showSettings: boolean
  /** 布局模式 */
  layoutMode: LayoutModeEnum
  /** 是否显示标签栏 */
  showTagsView: boolean
  /** 是否显示 Logo */
  showLogo: boolean
  /** 是否固定 Header */
  fixedHeader: boolean
  /** 是否显示页脚 Footer */
  showFooter: boolean
  /** 是否显示切换主题按钮 */
  showThemeSwitch: boolean
  /** 是否显示全屏按钮 */
  showScreenfull: boolean
  /** 是否缓存标签栏 */
  cacheTagsView: boolean
  /** 是否显示灰色模式 */
  showGreyMode: boolean
  /** 是否显示色弱模式 */
  showColorWeakness: boolean
}

/** 默认配置 */
const defaultSettings: LayoutSettings = {
  layoutMode: LayoutModeEnum.Left,
  showSettings: false,
  showTagsView: true,
  fixedHeader: true,
  showFooter: false,
  showLogo: true,
  showThemeSwitch: true,
  showScreenfull: true,
  cacheTagsView: false,
  showGreyMode: false,
  showColorWeakness: false,
}

/** 项目配置 */
export const layoutSettings: LayoutSettings = { ...defaultSettings, ...getConfigLayout() }
