import type * as Console from './types/console'
import { request } from '@/utils/service'

/** 运输方式增加接口 */
export function consoleTransportationModeNew(data: Console.ConsoleTransportationModeNewPar) {
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
export function consoleTransportationModeDelete(data: Console.ConsoleTransportationModeDeletePar) {
  return request<ApiResponseData<string>>({
    url: '/console/transportation-mode/delete',
    method: 'post',
    data,
  })
}
/** 服务方式查询 */
export function consoleTmsServiceInfoList() {
  return request<ApiResponseData<Console.ConsoleTmsServiceInfoListDataItem[]>>({
    url: '/console/tms/service-info/list',
    method: 'post',
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
/** 承运商公共代码分页列表 */
export function commoncodeSelectPageable(data: any) {
  return request<any>({
    url: '/console/common-code/carrier/select/pageable',
    method: 'post',
    data,
  })
}
/** 承运商公共代码新增 */
export function commoncodeNew(data: any) {
  return request<any>({
    url: '/console/common-code/carrier/new',
    method: 'post',
    data,
  })
}
/** 承运商公共代码del */
export function commoncodeDel(data: any) {
  return request<any>({
    url: '/console/common-code/carrier/delete',
    method: 'post',
    data,
  })
}
