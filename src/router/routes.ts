import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    name: 'Dashboard',
    meta: {
      title: '首页',
      svgIcon: 'dashboard',
      affix: true,
    },
  },
  {
    path: 'test',
    component: () => import('@/views/test/index.vue'),
    name: 'Test',
    meta: {
      title: '测试页面',
      svgIcon: 'dashboard',
    },
  },
]

export default routes
