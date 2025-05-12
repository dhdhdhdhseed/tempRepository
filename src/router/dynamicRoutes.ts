import type { RouteRecordRaw } from 'vue-router'

const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: 'permission',
    redirect: '/permission/page',
    name: 'Permission',
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: '页面级',
          roles: ['admin'], // 或者在子导航中设置角色
        },
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: '按钮级', // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        },
      },
    ],
  },
  {
    path: 'dynamicRoutes',
    redirect: '/dynamicRoutes/errorPage',
    children: [
      {
        path: 'errorPage',
        meta: {
          title: '错误页面',
        },
        children: [
          {
            path: '404',
            component: () => import('@/views/error-page/404.vue'),
            name: '404',
            meta: {
              title: '404页面',
            },
          },
          {
            path: '403',
            component: () => import('@/views/error-page/403.vue'),
            name: '403',
            meta: {
              title: '403页面',
            },
          },
        ],
      },
      {
        path: 'link',
        meta: {
          title: '外链',
        },
        children: [
          {
            path: 'https://juejin.cn/post/7089377403717287972',
            component: () => { },
            name: 'Link1',
            meta: {
              title: '中文文档',
            },
          },
          {
            path: 'https://juejin.cn/column/7207659644487139387',
            component: () => { },
            name: 'Link2',
            meta: {
              title: '新手教程',
            },
          },
        ],
      },
    ],
  },
]

export default dynamicRoutes
