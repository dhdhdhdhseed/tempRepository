interface PagePar {
  pageNumber: number
  pageSize: number
}

type SearchConfigType = 'select' | 'multiple_select' | 'input' | 'date'
interface Option { label: string, value: string | number }
interface SearchConfigItem {
  prop: string
  type: SearchConfigType
  label?: string
  placeholder?: string
  span?: number | string
  options?: readonly Option[]
}
