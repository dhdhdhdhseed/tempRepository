import type * as Console from './types/console'
import { request } from '@/utils/service'

/** 运输方式增加接口 */
export function consoleTransportationModeNew(data: any) {
  return request<any>({
    url: '/console/transportation-mode/new',
    method: 'post',
    data,
  })
}
