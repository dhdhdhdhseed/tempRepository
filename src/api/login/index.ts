import type * as Login from './types/login'
import { request } from '@/utils/service'

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: '/console/login',
    method: 'post',
    data,
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: 'users/info',
    method: 'get',
  })
}
