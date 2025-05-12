import type * as Console from './types/console'
import { request } from '@/utils/service'

/** 运输方式增加接口 */
export function consoleTransportationModeNew(data: any) {
  return request<ApiResponseData<string>>({
    url: '/console/transportation-mode/new',
    method: 'post',
    data,
  })
}

/** 运输方式分页查询 */
export function consoleTransportationModeSelectPageable(data: Console.ConsoleTransportationModeSelectPageablePar) {
  return request<ApiResponseData<Console.ConsoleTransportationModeSelectPageableData>>({
    url: '/console/transportation-mode/select/pageable',
    method: 'post',
    data,
  })
}
/** 运输方式更新 */
export function consoleTransportationModeUpdate(data: Console.ConsoleTransportationModeUpdatePar) {
  return request<ApiResponseData<string>>({
    url: '/console/transportation-mode/update',
    method: 'post',
    data,
  })
}
/** 运输方式删除 */
export function consoleTransportationModeDelete(data: any) {
  return request<ApiResponseData<string>>({
    url: '/console/transportation-mode/delete',
    method: 'post',
    data,
  })
}
/** 公共代码 */
export function commoncodeSelectType(data: any) {
  return request<any>({
    url: '/console/common-code/global/select/code-type',
    method: 'post',
    data,
  })
}
/** 公共代码分页列表 */
export function commoncodeSelectPageable(data: any) {
  return request<any>({
    url: '/console/common-code/carrier/select/pageable',
    method: 'post',
    data,
  })
}
