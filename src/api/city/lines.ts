import { config, ApiError, ResponseCode, ApiResponse, axios } from '..'
import { Traffic } from './traffic'

export const getCityLines = async (cid: number): Promise<{
  trafficList: Traffic[]
} & ApiResponse> => {
  if (config.mockFail) {
    throw new ApiError('get city lines error')
  }
  if (config.mock) {
    return {
      status: ResponseCode.success,
      trafficList: []
    }
  }
  const { data } = await axios.post('/traffic', { cid })
  return {
    status: data.status,
    trafficList: data.trafficList || data.trafficCityList
  }
}