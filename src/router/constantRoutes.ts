import type { RouteRecordRaw } from 'vue-router'
/**
 * 常驻路由
 */
const Layouts = () => import('@/layouts/index.vue')
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layouts,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true,
    },
    alias: '/:pathMatch(.*)*',
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true, // 是否在菜单栏上隐藏
    },
  },
  {
    path: '/',
    component: Layouts,
    redirect: '/login',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          elIcon: 'House',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/',
    component: Layouts,
    children: [
      {
        path: 'info',
        component: () => import('@/views/info/index.vue'),
        name: 'info',
        meta: {
          title: '配置承运商',
          elIcon: 'Setting',
        },
      },
    ],
  },

  {
    path: '/',
    component: Layouts,
    children: [
      {
        path: 'transportation',
        component: () => import('@/views/transportation/transportation.vue'),
        name: 'transportation',
        meta: {
          title: '运输方式管理',
          elIcon: 'SetUp',
        },
      },
    ],
  },

  {
    path: '/',
    component: Layouts,
    children: [
      {
        path: 'commoncode',
        component: () => import('@/views/template-manage/commoncode.vue'),
        name: 'commoncode',
        meta: {
          title: '承运商公共代码管理',
          elIcon: 'Files',
        },
      },
    ],
  },
  {
    path: '/',
    component: Layouts,
    children: [
      {
        path: 'shipment-order',
        component: () => import('@/views/shipment-order/shipment-order.vue'),
        name: 'shipment-order',
        meta: {
          title: '运单列表',
          elIcon: 'Tickets',
        },
      },
    ],
  },
  {
    path: '/',
    component: Layouts,
    children: [
      {
        path: 'routed-events',
        component: () => import('@/views/routedEvents/index.vue'),
        name: 'routed-events',
        meta: {
          title: '路由事件配置',
          elIcon: 'Tickets',
        },
      },
    ],
  },
]
export default constantRoutes
