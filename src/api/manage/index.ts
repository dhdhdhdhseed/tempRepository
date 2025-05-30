/*
 * @Author: LYG liaoyanguo
 * @Date: 2025-05-12 16:58:21
 * @LastEditors: LYG liaoyanguo
 * @LastEditTime: 2025-05-13 15:13:57
 * @Email: liaoyanguo@foxmail.com
 * @Description:
 * @FilePath: /tempRepository/src/api/manage/index.ts
 */
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
/** 承运商公共代码 */
export function consoleCommonCodeCarrierSelectCodeType(data: any) {
  return request<any>({
    url: '/console/common-code/carrier/select/code-type',
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
/** 承运商 */
export function carrierDetail(data: any) {
  return request<any>({
    url: '/console/carrier/detail',
    method: 'post',
    data,
  })
}
export function carrierUpdate(data: any) {
  return request<any>({
    url: '/console/carrier/update/carrier-code',
    method: 'post',
    data,
  })
}

// 运输订单
export function consoleShipmentOrderSelectPageable(data: Console.ConsoleShipmentOrderSelectPageablePar) {
  return request<ApiResponseData<Console.ConsoleShipmentOrderSelectPageableData>>({
    url: '/console/shipment-order/select/pageable',
    method: 'post',
    data,
  })
}

// 路由配置列表
export function consoleTrackingEventConfigList() {
  return request<ApiResponseData<any>>({
    url: '/console/tracking-event-config/list',
    method: 'post',
  })
}
// 路由配置新增
export function consoleTrackingEventConfigNew(data: any) {
  return request<ApiResponseData<any>>({
    url: '/console/tracking-event-config/new',
    method: 'post',
    data,
  })
}
// 路由配置修改
export function consoleTrackingEventConfigUpdate(data: any) {
  return request<ApiResponseData<any>>({
    url: '/console/tracking-event-config/update',
    method: 'post',
    data,
  })
}
// 路由配置删除
export function consoleTrackingEventConfigDelete(data: any) {
  return request<ApiResponseData<any>>({
    url: '/console/tracking-event-config/delete',
    method: 'post',
    data,
  })
}
// EDD配置分页
export function consoleTrackingEventEddConfigSelectPageable(data: any) {
  return request<ApiResponseData<any>>({
    url: '/console/tracking-event-edd-config/select/pageable',
    method: 'post',
    data,
  })
}
// EDD配置修改
export function consoleTrackingEventEddConfigUpdate(data: any) {
  return request<ApiResponseData<any>>({
    url: '/console/tracking-event-edd-config/update',
    method: 'post',
    data,
  })
}
// 运单修改更新
export function consoleShipmentOrderUpdate(data: any) {
  return request<ApiResponseData<any>>({
    url: '/console/shipment-order/update',
    method: 'post',
    data,
  })
}
