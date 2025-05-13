export interface PageableResponse {
  total: string
  pageNum: number
  pageSize: number
  size: number
  startRow: string
  endRow: string
  pages: number
  prePage: number
  nextPage: number
  isFirstPage: boolean
  isLastPage: boolean
  hasPreviousPage: boolean
  hasNextPage: boolean
  navigatePages: number
  navigatepageNums: number[]
  navigateFirstPage: number
  navigateLastPage: number
}

export interface ConsoleTransportationModeSelectPageablePar extends PagePar {
  serviceCode?: string
  countryCode?: string
  awsTransportMode?: string
  serviceLevel?: string
  lastLegDeliveryMode?: string
}

export interface ConsoleTransportationModeDataItem {
  id: string
  carrierCode: string
  serviceCode: string
  awsTransportMode: string
  serviceLevel: string
  lastLegDeliveryMode: string
  countryCode: string
  minTransitDays: number
  maxTransitDays: number
}

export interface ConsoleTransportationModeSelectPageableData extends PageableResponse {
  list: ConsoleTransportationModeDataItem[]
}

export interface ConsoleTransportationModeUpdatePar {
  id: string
  serviceCode: string
  awsTransportMode: string
  serviceLevel: string
  lastLegDeliveryMode: string
  countryCode: string
  minTransitDays: string
  maxTransitDays: string
}
export interface ConsoleTransportationModeNewPar {
  serviceCode: string
  awsTransportMode: string
  serviceLevel: string
  lastLegDeliveryMode: string
  countryCode: string
  minTransitDays: string
  maxTransitDays: string
}
export interface ConsoleTransportationModeDeletePar {
  ids: string[]
}

export interface ConsoleTmsServiceInfoListDataItem {
  code: string
  name: string
}

export interface ShipmentOrderItem {
  id: string
  carrierCode: string
  fbaShipmentId: string
  trackingId: string
  orderStatus: number
  idSyncStatus: number
  ldTransportationInfoFirstSyncStatus: number
  ldTransportationInfoLastSyncStatus: number
  teTransportationInfoSyncStatus: number
  completionStatus: number
}
export interface ConsoleShipmentOrderSelectPageableData extends PageableResponse {
  list: ShipmentOrderItem[]
}
export interface ConsoleShipmentOrderSelectPageablePar {
  pageNumber: number
  pageSize: number
  trackingId?: string
}
