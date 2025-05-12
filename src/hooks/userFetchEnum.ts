import { commoncodeSelectType } from '@/api/manage/index'
import { onMounted, reactive, ref } from 'vue'

/** Select 需要的数据格式 */
interface EnmuData {
  code: string
  value: string
  codeType: number
  language?: string
}
interface EnmuOptions {
  value: string | number
  label: string
}
interface EnmuObjectData {
  [key: string]: EnmuData
}

/** 接口响应格式 */
type ApiData = ApiResponseData<EnmuData[]>

/** 入参格式 */
interface FetchEnumProps {
  id: string
  api?: any
}
export function useFetchEnum(props: FetchEnumProps, callback?: any) {
  const { codeType, api } = props
  const params = {
    codeType,
  }
  const enumData = reactive({
    data: <EnmuData[]>[],
    enmuOptions: <EnmuOptions[]>[],
    enmuObject: <EnmuObjectData>{},
  })
  const loading = ref<boolean>(false)

  /** 调用接口获取数据 */
  const loadData = () => {
    loading.value = true
    const apiUrl = api || commoncodeSelectType
    apiUrl(params)
      .then((res: ApiData) => {
        enumData.data = res.data
        enumData.enmuOptions = res.data.map((it: EnmuData) => ({ value: it.code, label: it.value }))
        res.data.forEach((it: EnmuData) => {
          enumData.enmuObject[it.code] = it
        })
        if (callback) {
          callback()
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(async () => {
    await loadData()
  })

  return enumData
}
