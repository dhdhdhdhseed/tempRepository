import type { RouteRecordRaw } from 'vue-router'
import { setRouteChange } from '@/hooks/useRouteListener'
import { useTitle } from '@/hooks/useTitle'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import constantRoutes from './constantRoutes'
import 'nprogress/nprogress.css'

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [

]
const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: import.meta.env.VITE_ROUTER_HISTORY === 'hash'
    ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
    : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes,
})

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  // const userStore = useUserStoreHook()
  // const permissionStore = usePermissionStoreHook()
  // const token = getToken()

  // 如果没有登陆
  // if (!token) {
  //   // 如果在免登录的白名单中，则直接进入
  //   if (isWhiteList(to)) {
  //     return next()
  //   }
  //   // 其他没有访问权限的页面将被重定向到登录页面
  //   return next('/login')
  // }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  // if (to.path === '/login') {
  //   return next({ path: '/' })
  // }

  // 如果用户已经获得其权限角色
  // if (userStore.roles.length !== 0) {
  //   return next()
  // }

  try {
    next()
  }
  catch (err: any) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    // userStore.resetToken()
    ElMessage.error(err.message || '路由守卫过程发生错误')
    next('/login')
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  }
  catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
