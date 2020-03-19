import { ApiResponse, config, ApiError, ResponseCode, axios } from '..'

export interface ActiveNumber {
  /** 注意这里为了方便使用没有转成Date */
  time: string
  number: number
}
export interface City {
  cid: number
  cname: string
  name: string
  number: number
  activeNumberList: ActiveNumber[]
}
export const getCities = async (): Promise<{
  cityList: City[]
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('get cities error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      cityList: []
    }
  }
  const { data } = await axios.get('/city')
  return {
    status: data.status,
    cityList: data.cityList
  }
}